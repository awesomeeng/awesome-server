// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const Log = require("AwesomeLog");
const AwesomeUtils = require("AwesomeUtils");

const AbstractServer = require("./AbstractServer");
const AbstractRequest = require("./AbstractRequest");
const AbstractResponse = require("./AbstractResponse");
const AbstractController = require("./AbstractController");

const AbstractPathMatcher = require("./AbstractPathMatcher");

const FileServeController = require("./controllers/FileServeController");
const DirectoryServeController = require("./controllers/DirectoryServeController");
const PushServeController = require("./controllers/PushServeController");
const RedirectController = require("./controllers/RedirectController");

const $SERVERS = Symbol("servers");
const $ROUTES = Symbol("routes");
const $RUNNING = Symbol("running");

class AwesomeServer {
	constructor() {
		this[$RUNNING] = false;
		this[$SERVERS] = new Set();
		this[$ROUTES] = [];
	}

	static get AbstractServer() {
		return AbstractServer;
	}

	static get AbstractRequest() {
		return AbstractRequest;
	}

	static get AbstractResponse() {
		return AbstractResponse;
	}

	static get AbstractController() {
		return AbstractController;
	}

	get servers() {
		return [].concat([...this[$SERVERS]]);
	}

	get routes() {
		return this[$ROUTES].map((route)=>{
			return route.method.toUpperCase()+": "+route.path.toString();
		});
	}

	get running() {
		return this[$RUNNING];
	}

	async start() {
		if (this.running) return Promise.resolve();

		Log.info("AwesomeServer","Starting...");

		if (this[$SERVERS].size<1) {
			Log.warn("AwesomeServer","No servers defined. Nothing to do.");
		}
		else {
			await Promise.all([...this[$SERVERS]].map((server)=>{
				let prom = server.start(this.handler.bind(this));
				if (prom instanceof Promise) return prom;
				return Promise.resolve();
			}));
		}

		this[$RUNNING] = true;

		Log.info("AwesomeServer","Started.");
	}

	async stop() {
		if (!this.running) return Promise.resolve();

		Log.info("AwesomeServer","Stopping...");

		await Promise.all([...this[$SERVERS]].map((server)=>{
			let prom = server.stop();
			if (prom instanceof Promise) return prom;
			return Promise.resolve();
		}));

		this[$RUNNING] = false;

		Log.info("AwesomeServer","Stopped.");
	}

	addServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		this[$SERVERS].add(server);
	}

	addHTTPServer(config) {
		const HTTPServer = require("./http/HTTPServer"); // this is here on purpose.
		let server = new HTTPServer(config);
		this.addServer(server);
	}

	addHTTPSServer(config) {
		const HTTPSServer = require("./https/HTTPSServer"); // this is here on purpose.
		let server = new HTTPSServer(config);
		this.addServer(server);
	}

	addHTTP2Server(config) {
		const HTTP2Server = require("./http2/HTTP2Server"); // this is here on purpose.
		let server = new HTTP2Server(config);
		this.addServer(server);
	}

	removeServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		this[$SERVERS].delete(server);
		if (server.running) server.stop();
	}

	route(method,path,handler) {
		// we are just wrapping the internal function here so we dont expose what the internal functions returns.
		_route.call(this,method,path,handler);
	}

	unroute(method,path,handler) {
		// we are just wrapping the internal function here so we dont expose what the internal functions returns.
		return _unroute.call(this,method,path,handler);
	}

	redirect(path,toPath,temporary=false) {
		if (!path) throw new Error("Missing path.");
		if (!toPath) throw new Error("Missing toPath.");
		if (typeof toPath!=="string") throw new Error("Invalid toPath.");

		this.route("*",path,new RedirectController(toPath,temporary));
	}

	serve(path,contentType,filename) {
		if (arguments.length===2) [path,contentType,filename] = [path,null,contentType];

		if (!path) throw new Error("Missing path.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		let resolved = _resolve(filename);
		if (!resolved) throw new Error("Filename or directory not found: "+filename);

		let file = resolved.filename;
		let stat = resolved.stat;

		if (stat.isDirectory()) {
			let controller = new DirectoryServeController(file);
			let parent = _route.call(this,"*",path,controller);
			_route.call(this,"*",path+"/".replace(/\/\/+/g,"/"),controller,parent);
			_route.call(this,"*",path+"/".replace(/\/\/+/g,"/")+"*",controller,parent);
		}
		else if (stat.isFile()) {
			this.route("*",path,new FileServeController(contentType,file));
		}
		else {
			throw new Error("Invalid filename, is neither directory or file: "+filename);
		}
	}

	push(path,referencePath,contentType,filename) {
		if (arguments.length===3) [path,referencePath,contentType,filename] = [path,referencePath,null,contentType];

		if (!path) throw new Error("Missing path.");
		if (!referencePath) throw new Error("Missing referencePath.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		let resolved = _resolve(filename);
		if (!resolved) throw new Error("Filename not found: "+filename);

		let file = resolved.filename;
		let stat = resolved.stat;

		if (stat.isFile()) {
			this.route("*",path,new PushServeController(referencePath,contentType,file));
		}
		else {
			throw new Error("Invalid filename, is not a file: "+filename);
		}
	}

	resolve(filename) {
		let resolved = _resolve(filename);
		return resolved && resolved.filename || null;
	}

	async handler(request,response) {
		if (!request) throw new Error("Missing request.");
		if (!(request instanceof AbstractRequest)) throw new Error("Invalid request.");
		if (!response) throw new Error("Missing response.");
		if (!(response instanceof AbstractResponse)) throw new Error("Invalid response.");

		let method = request.method.toUpperCase();
		let url = request.method+" "+(request.url && request.url.href || request.url && request.url.toString() || request.url.toString());
		let path = request.path || "/";

		Log.access("AwesomeServer","Request "+url+" from "+request.origin+".");

		let matching = this[$ROUTES].filter((route)=>{
			return (route.method==="*" || route.method===method) && route.matcher.match(path) && route.routes && route.routes.length>0;
		});

		let proms = matching.reduce((proms,route)=>{
			if (proms instanceof Error) return proms;

			let mypath = path;
			if (typeof route.path==="string") {
				if (route.path.endsWith("*")) mypath = mypath.slice(route.path.length-1);
				else if (route.path.startsWith("*")) mypath = mypath.slice(0,-(route.path.length-1));
				else mypath = mypath.slice(route.path.length);
			}

			route.routes.forEach((r)=>{
				if (proms instanceof Error) return;

				try {
					proms.push(r.call(this,mypath,request,response));
				}
				catch (ex) {
					proms = ex && ex instanceof Error || new Error("Unknown error handling request.");
					return;
				}
			});

			return proms;
		},[]);

		if (proms instanceof Error) {
			Log.error("AwesomeServer","Error handling request "+url+".",proms);
			response.writeError(500,"Error handling request "+url+".");
			return;
		}
		else {
			await Promise.all(proms);
			if (!response.finished) {
				Log.error("AwesomeServer","404 Not found "+url+".");
				response.writeError(404,"404 Not found "+url+".");
			}
		}
	}
}

const _route = function route(method,path,handler,parent=null) {
	if (typeof method==="string" && path instanceof AbstractController) [method,path,handler,parent] = ["*",...arguments];
	if (typeof method==="string" && AbstractController.isPrototypeOf(path)) [method,path,handler,parent] = ["*",...arguments];

	if (!method) throw new Error("Missing method.");
	if (typeof method!=="string") throw new Error("Invalid method.");
	if (!path) throw new Error("Missing path.");
	if (typeof path!=="string" && !(path instanceof RegExp)) throw new Error("Invalid path.");
	if (!handler) throw new Error("Missing handler.");

	method = method.toUpperCase();
	let route = {
		method,
		path,
		handler,
		routes: null,
		matcher: AbstractPathMatcher.getMatcher(path)
	};

	if (handler instanceof AbstractController) {
		_routeController.call(this,route,handler);
	}
	else if (AbstractController.isPrototypeOf(handler)) {
		_routeController.call(this,route,new handler());
	}
	else if (handler instanceof Function) {
		_routeFunction.call(this,route,handler);
	}
	else if (typeof handler==="string") {
		let resolved = _resolve(handler);
		if (resolved===null) throw new Error("Invalid handler, file or directory not found: "+filename);

		let filename = resolved.filename;
		let stat = resolved.stat;

		if (stat.isDirectory()) {
			_routeDirectory.call(this,route,filename,path);
		}
		else if (stat.isFile()) {
			_routeFile.call(this,route,filename);
		}
		else {
			throw new Error("Invalid handler, is neither directory or file: "+filename);
		}
	}
	if (!route.routes) throw new Error("Invalid handler.");

	this.unroute(method,path,handler);
	this[$ROUTES].push(route);
	if (parent) {
		parent.children = parent.children || [];
		parent.children.push(route);
	}

	Log.info("AwesomeServer","Added route "+method+" "+path.toString());

	return route;
};

const _routeFunction = function routeContoller(route,handler) {
	route.routes = [function router(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				if (response.finished) return resolve();

				let prom = handler(path,request,response);
				if (prom instanceof Promise) await prom;
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}];

	return route;
};

const _routeController = function routeController(route,controller) {
	_routeFunction.call(this,route,controller.handler.bind(controller));
	return route;
};

const _routeFile = function routeControllerFile(route,filename) {
	let clazz;
	try {
		clazz = AwesomeUtils.Module.require(filename);
	}
	catch (ex) {
		Log.error("DefaultRouter","Error loading controller "+filename,ex);
		throw ex;
	}

	if (!clazz) {
		Log.error("DefaultRouter","Loaded controller not found "+filename);
		throw new Error("Loaded controller not found "+filename);
	}
	else if (clazz instanceof Function && AbstractController.isPrototypeOf(clazz)) {
		let instance;
		try {
			instance = new clazz();
		}
		catch (ex) {
			Log.error("DefaultRouter","Error instantiating controller.",ex);
			throw ex;
		}
		if (!(instance instanceof AbstractController)) {
			Log.error("DefaultRouter","Loaded controller does not extend AbstractController "+filename);
			throw new Error("Loaded controller does not extend AbstractController "+filename);
		}

		Log.info("AwesomeServer","Loaded controller from "+filename+".");
		_routeController.call(this,route,instance);
	}
	else if (clazz instanceof AbstractController) {
		Log.info("AwesomeServer","Loaded controller from "+filename+".");
		_routeController.call(this,route,clazz);
	}
	else {
		Log.error("DefaultRouter","Loaded controller does not extend AbstractController "+filename);
		throw new Error("Loaded controller does not extend AbstractController "+filename);
	}

	return route;
};

const _routeDirectory = function routeDirectory(parent,dir,path="/") {
	parent.routes = [];

	FS.readdirSync(dir).forEach((filename)=>{
		filename = Path.resolve(dir,filename);
		let filepath = ((path && path!=="/" && path!=="." && path!==".." ? path+"/" : "/")+Path.basename(filename,Path.extname(filename))).replace(/\/\/+/g,"/");
		let ext = Path.extname(filename);
		let stats = null;
		try {
			stats = FS.statSync(filename);
		}
		catch (ex) {
			stats = null;
		}
		if (!stats) return;

		if (stats.isDirectory()) return routeDirectory.call(this,parent,filename,filepath);

		if (ext===".js" || ext===".node") _route.call(this,"*",filepath,filename,parent);
	});
};

const _unroute = function _unroute(method,path,handler) {
	if (typeof method==="string" && path instanceof AbstractController) [method,path,handler] = ["*",...arguments];
	if (typeof method==="string" && AbstractController.isPrototypeOf(path)) [method,path,handler] = ["*",...arguments];

	if (!method) throw new Error("Missing method.");
	if (typeof method!=="string") throw new Error("Invalid method.");
	if (!path) throw new Error("Missing path.");
	if (typeof path!=="string" && !(path instanceof RegExp)) throw new Error("Invalid path.");

	method = method.toUpperCase();

	// find matching routes
	let matching = this[$ROUTES].filter((route)=>{
		return route.method===method &&
			(
				(route.path instanceof RegExp && path instanceof RegExp && route.path.toString()===path.toString()) ||
				(typeof route.path==="string" && typeof path==="string" && route.path===path)
			)
		&& (!handler || route.handler===handler);
	});

	// remove them
	this[$ROUTES] = this[$ROUTES].filter((route)=>{
		return matching.indexOf(route)<0;
	});

	// cleanup child routes if any
	matching.forEach((route)=>{
		(route.children||[]).forEach((child)=>{
			_unroute.call(this,child.method,child.path,child.handler);
		});
	});

	if (matching.length>0) Log.info("AwesomeServer","Removed route "+method+" "+path.toString());

	return matching.length>0;
};

/**
 * Attempts to locate a given filename. The filename is tried itself, then tried relative
 * to the module.parent (the calling module), or finally relative to process.cwd(). If
 * it is found in one of these, that is returned along with the stat object for that
 * filename. If none of these approaches works, null is returned.
 *
 * @param  {string} filename The filename to try and locate.
 *
 * @return {Object} The filename and FS.stat result for the found file.
 *
 * @private
 */
const _resolve = function resolve(filename) {
	const getStat = (f)=>{
		try {
			Log.debug("AwesomeServer","Looking for "+f);
			return FS.statSync(f);
		}
		catch (ex) {
			return null;
		}
	};

	let path,stat;

	// try the filename itself
	path = filename;
	stat = getStat(path);
	if (stat) return {
		filename: path,
		stat
	};

	// try the filename relative to the module
	if (module && module.parent) {
		path = AwesomeUtils.Module.resolve(module.parent,filename);
		stat = getStat(path);
		if (stat) return {
			filename: path,
			stat
		};
	}

	// try the filename relative to process.cwd()
	path = Path.resolve(process.cwd(),filename);
	stat = getStat(path);
	if (stat) return {
		filename: path,
		stat
	};

	// fail
	return null;
};


module.exports = AwesomeServer;

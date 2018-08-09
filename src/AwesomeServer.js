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

/**
 * AwesomeServer is a customizable API Server framework for Enterprise Ready nodejs
 * applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
 * provide flexible routing and controllers for responding to incoming requests in a
 * consistent, repeatable fashion.
 *
 * Please see the documentation at @link https://github.com/awesomeeng/AwesomeServer.
 */
class AwesomeServer {
	/**
	 * Creates a new AwesomeServer instance.
	 *
	 * You may create multiple AwesomeServer instances and do different things with them.
	 *
	 * @constructor
	 *
	 */
	constructor() {
		this[$RUNNING] = false;
		this[$SERVERS] = new Set();
		this[$ROUTES] = [];
	}

	/**
	 * Returns a reference to the AbstractServer class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractServer() {
		return AbstractServer;
	}

	/**
	 * Returns a reference to the AbstractRequest class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractRequest() {
		return AbstractRequest;
	}

	/**
	 * Returns a reference to the AbstractResponse class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractResponse() {
		return AbstractResponse;
	}

	/**
	 * Returns a reference to the AbstractController class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractController() {
		return AbstractController;
	}

	/**
	 * Returns a reference to the AbstractPathMatcher class for custom extensions.
	 */
	static get AbstractPathMatcher() {
		return AbstractPathMatcher;
	}

	/**
	 * Returns references to HTTPServer, HTTPRequest, and HTTPResponse for custom extensions.
	 */
	static get http() {
		return {
			HTTPServer: require("./http/HTTPServer"),
			HTTPRequest: require("./http/HTTPRequest"),
			HTTPResponse: require("./http/HTTPResponse")
		};
	}

	/**
	 * Returns references to HTTPSServer, HTTPSRequest, and HTTPSResponse for custom extensions.
	 */
	static get https() {
		return {
			HTTPSServer: require("./https/HTTPSServer"),
			HTTPSRequest: require("./https/HTTPSRequest"),
			HTTPSResponse: require("./https/HTTPSResponse")
		};
	}

	/**
	 * Returns references to HTTP2Server, HTTP2Request, and HTTP2Response for custom extensions.
	 */
	static get http2() {
		return {
			HTTP2Server: require("./http2/HTTP2Server"),
			HTTP2Request: require("./http2/HTTP2Request"),
			HTTP2Response: require("./http2/HTTP2Response")
		};
	}

	/**
	 * Returns the array of servers associated with this AwesomeServer instance.
	 *
	 * @return {Array<AbstractServer>}
	 */
	get servers() {
		return [].concat([...this[$SERVERS]]);
	}

	/**
	 * Returns the array of routes as strings associated with this AwesomeServer instance.
	 *
	 * @return {Array<string>}
	 */
	get routes() {
		return this[$ROUTES].map((route)=>{
			return route.method.toUpperCase()+": "+route.path.toString();
		});
	}

	/**
	 * Returns true if this AwesomeServer is running (start() has been executed).
	 *
	 * @return {boolean}
	 */
	get running() {
		return this[$RUNNING];
	}

	/**
	 * Starts the AwesomeServer instance, if not already running. This in turn will
	 * start each added server and begin to route incoming requests.
	 *
	 * @return {Promise} [description]
	 */
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

	/**
	 * Stops the AwesomeServer instance, if running. This in turn will
	 * stop each added server and stop routing incoming requests.
	 *
	 * @return {Promise} [description]
	 */
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

	/**
	 * Adds a new server instance to the AwesomeServer. You may add multiple servers
	 * to  single AwesomeServer and each server will be handled for incoming requests
	 * and routed the same way.
	 *
	 * Primarily this method is for adding custom servers. If you are using the default
	 * HTTP, HTTPS, or HTTP/2 servers, use the addHTTPServer(), addHTTPSServer() or
	 * addHTTP2Server() functions instead.
	 *
	 * @param {AbstractServer} server The server instance to add. Must be an extension
	 * of AbstractServer.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	addServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		this[$SERVERS].add(server);

		return server;
	}

	/**
	 * Adds a new HTTP Server to the AwesomeServer instance. The HTTP Server is
	 * a wrapped version of nodejs's *http* module and thus behaves as that
	 * module behaves, with some slight differences.  Each request that comes
	 * through will have its request and response objects wrapped in AwesomeServer's
	 * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
	 * cleaner access layer to the underlying request or response. See AbstractRequest
	 * and AbstractResponse for more details.
	 *
	 * Takes a *config* object as an argument that is passed to the underlying HTTP
	 * module.  The basic structure of this config is below with the default values shown:
	 *
	 * ```
	 * const config = {
	 *   host: "localhost"
	 *   port: 7080
	 * };
	 * ```
	 * For more details about config values, please see [nodejs' http module]()
	 *
	 * **An important note about config**: The default *host* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs http module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	addHTTPServer(config) {
		const HTTPServer = require("./http/HTTPServer"); // this is here on purpose.
		let server = new HTTPServer(config);
		this.addServer(server);

		return server;
	}

	/**
	 * Adds a new HTTPS Server to the AwesomeServer instance. The HTTPS Server is
	 * a wrapped version of nodejs's *https* module and thus behaves as that
	 * module behaves, with some slight differences.  Each request that comes
	 * through will have its request and response objects wrapped in AwesomeServer's
	 * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
	 * cleaner access layer to the underlying request or response. See AbstractRequest
	 * and AbstractResponse for more details.
	 *
	 * Takes a *config* object as an argument that is passed to the underlying HTTPS
	 * module.  The basic structure of this config is below with the default values shown:
	 *
	 * ```
	 * const config = {
	 *   host: "localhost"
	 *   port: 7080,
	 *   key: null,
	 *   cert: null,
	 *   pfx: null
	 * };
	 * ```
	 *
	 * *key*, *cert*, and *pfx* are handled specially in AwesomeServer. You may supply
	 * a string representing the certificate or a string representing a valid path
	 * to a file containing the certificate. AwesomeServer will attempt to load
	 * the file and if successful use that as the value.
	 *
	 * For more details about config values, please see [nodejs' *https* module]()
	 *
	 * **An important note about config**: The default *host* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs *https* module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	addHTTPSServer(config) {
		const HTTPSServer = require("./https/HTTPSServer"); // this is here on purpose.
		let server = new HTTPSServer(config);
		this.addServer(server);

		return server;
	}

	/**
	 * Adds a new HTTP/2 Server to the AwesomeServer instance. The HTTP/2 Server is
	 * a wrapped version of nodejs's *http2* module and thus behaves as that
	 * module behaves, with some slight differences.  Each request that comes
	 * through will have its request and response objects wrapped in AwesomeServer's
	 * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
	 * cleaner access layer to the underlying request or response. See AbstractRequest
	 * and AbstractResponse for more details.
	 *
	 * Takes a *config* object as an argument that is passed to the underlying HTTP/2
	 * module.  The basic structure of this config is below with the default values shown:
	 *
	 * ```
	 * const config = {
	 *   host: "localhost"
	 *   port: 7080,
	 *   key: null,
	 *   cert: null,
	 *   pfx: null
	 * };
	 * ```
	 *
	 * *key*, *cert*, and *pfx* are handled specially in AwesomeServer. You may supply
	 * a string representing the certificate or a string representing a valid path
	 * to a file containing the certificate. AwesomeServer will attempt to load
	 * the file and if successful use that as the value.
	 *
	 * For more details about config values, please see [nodejs' *http2* module]()
	 *
	 * **An important note about config**: The default *host* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs *http2* module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	addHTTP2Server(config) {
		const HTTP2Server = require("./http2/HTTP2Server"); // this is here on purpose.
		let server = new HTTP2Server(config);
		this.addServer(server);

		return server;
	}

	/**
	 * Removes a given server from thise AwesomeServer instance. You obtain the server value
	 * as a return value from `addServer()` or `addHTTPServer()` or `addHTTPSServer()` or
	 * `addHTTP2Server()` or from the `servers` getter.
	 *
	 * If the removed server is currently running, it will automatically be stopped as
	 * part of its removal.
	 *
	 * @param  {AbstractServer} server The server to remove.
	 *
	 * @return {boolean}        true if the server was removed.
	 */
	removeServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		if (this[$SERVERS].has(server)) {
			this[$SERVERS].delete(server);
			if (server.running) server.stop();
			return true;
		}
		return false;
	}

	/**
	 * Add a route for incoming requests. A route is defined as some handler that responds to
	 * an incoming request. Routing is the backbone of AwesomeServer which takes an incoming
	 * request from a server, matches zero or more routes against the request, and then
	 * executes each matching route.
	 *
	 * Routing is decribed in much more detail in our routing documentation:
	 *
	 * route() has four different invocations that have slightly different meanings, depending on
	 * the arguments passed into it.
	 *
	 * 	 route(method,path,handler) - The most basic form of routing, this will execute the given
	 * 	 handler Function if the method and path match for an incoming request. (see method and see
	 * 	 path below.)
	 *
	 *   route(method,path,controller) - This will execute the given controller (see
	 *   controllers below) if the method and path match for an incoming request. (see method and
	 *   see path below).
	 *
	 *   route(method,controller) - A synonym for calling route("*",path,controller).
	 *
	 *   route(string,path,filename) - A synonym for calling route(method,path,controller)
	 *   except the given filename is loaded an instantiated as a controller first. This lets you
	 *   reference external controllers by filename easily.
	 *
	 * method: The method argument is a string that identifies one of the well known HTTP Methods
	 * or a wildcard character "*" to match all methods.  The HTTP Methods supported are GET, POST,
	 * PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE, and PATCH.
	 *
	 * path: The path argument may be either a string, a Regular Expression, or an instance of
	 * AbstractPathMatcher. A path matches the path portion of the url; not including the
	 * search/query or hash portions.
	 *
	 *   string: Five different types of string paths can be defined:
	 *
	 * 		exact: A string that matches exactly the url path from the request. Exact path
	 * 		strings look like this: "/test" and do not contain any wildcard "*" or or "|"
	 * 		characters.
	 *
	 * 		startsWith: A string that matches the beginning portion of the url path from the
	 * 		request.  startsWith strings look like this: "/test*" and must end with a
	 * 		wildcard character "*" and may not contain an or "|" character.
	 *
	 * 		endsWith: A string that matches the ending portion of the url path from the
	 * 		request. endsWith strings look like this: "*test" and must begin with a
	 * 		wildcard character "*" and may not contain an or "|" character.
	 *
	 * 		contains: A string that matches if contained within some portion (including the
	 * 		beginning and ending) of the url path from the request.  contains strings look like
	 * 		this: "*test*" and must both begin with and end with the wildcard "*" character and
	 * 		may not contain an or "|" character.
	 *
	 * 		or: two or more path strings (from the above options) separated by an or "|"
	 * 		character where at least one of the or segments matches the url path from the
	 * 		request.  Or strings look like this: "/test|/test/*".
	 *
	 *   RegExp: a regular expression that matches the url path from the request. RegExp
	 *   paths look like this: /^\/test$/
	 *
	 *   AbstractPathMatcher: You may provide your own implementation of AbstractPathMatcher
	 *   to be used to determine if the url path of the request is a match. AbstractPathMatcher
	 *   would need to be extended and the match(path), subtract(path) and toString() methods
	 *   would need to be implemented.
	 *
	 * handler: A handler function that will be executed when the incoming request method
	 * and path matches.  The handler function has the following signature:
	 *
	 * 		handler(path,request,response)
	 *
	 * 			path: is the modified path of the incoming request. It has been modified, but
	 * 			removing the matching path out of it.  For example, if the incoming path is
	 * 			"/api/xyz" and the route path argument is "/api/*" this path argument would
	 * 			have "xyz" as its value; the "/api/" was removed out.
	 *
	 * 			request: An instance of AbstractRequest which wraps the underlying request
	 * 			object from the server. See AbstractRequest for more details.
	 *
	 * 			response: An instance of AbstractResponse which wraps the underlying response
	 * 			obect from the server. See AbstractResponse for more details.
	 *
	 * controller: An instance of AbstractController that will be executed when the incoming
	 * request method and path matches.  Controllers are a great way to strcuture your API
	 * endpoints around url resources. For more information on controllers go here:
	 *
	 * @param  {string} method  [description]
	 * @param  {(string|RegExp|AbstractPathMatcher)} path    [description]
	 * @param  {(Function|AbstractController)} handler [description]
	 */
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

	Log.info("AwesomeServer","Added route "+method+" "+route.matcher.toString());

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

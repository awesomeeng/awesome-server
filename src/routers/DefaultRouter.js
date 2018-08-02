// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const Mime = require("mime-types");

const Log = require("AwesomeLog");
const AwesomeUtils = require("AwesomeUtils");

const AbstractRouter = require('../AbstractRouter');
const AbstractController = require('../AbstractController');

const FileServeController = require("../controllers/FileServeController");
const DirectoryServeController = require("../controllers/DirectoryServeController");
const PushServeController = require("../controllers/PushServeController");
const RedirectController = require("../controllers/RedirectController");

const $ROUTES = Symbol("routes");
const $PREFIX = Symbol("prefix");

class DefaultRouter extends AbstractRouter {
	constructor(prefix="/") {
		super();

		this[$PREFIX] = prefix;
		this[$ROUTES] = [];
	}

	get prefix() {
		return this[$PREFIX];
	}

	set prefix(s="/") {
		if (typeof s!=="string") throw new Error("Invalid prefix, must be a string.");
		this[$PREFIX] = s;
	}

	fullPath(path) {
		if (!path) return this.prefix;
		if (path instanceof RegExp) return this.prefix+" "+path.toString();
		return (this.prefix+"/"+path.toString()).replace(/\/\/+/g,"/");
	}

	matchRoutes(method,path,handler) {
		path = this.prefix && this.prefix!=="/" && path.startsWith(this.prefix) && path.slice(this.prefix.length) || path;
		return this[$ROUTES].filter((route)=>{
			if (!route.method) return false;
			if (!(route.method===method || route.method==="*")) return false;
			if (!route.handler) return false;
			if (!(route.handler instanceof Function)) return false;
			if (handler && route.handler!==handler) return false;
			if (route.path instanceof RegExp) return path.match(route.path);
			if (route.path.endsWith("*")) return path.startsWith(route.path.slice(0,-1));
			if (route.path.startsWith("*")) return path.endsWith(route.path.slice(1));
			return route.path===path;
		});
	}

	route(path,request,response) {
		let method = request.method;
		if (this.prefix && !path.startsWith(this.prefix)) return Promise.resolve();

		return new Promise(async (resolve,reject)=>{
			try {
				let matching = this.matchRoutes.call(this,method,path);
				await Promise.all(matching.map((route)=>{
					return new Promise(async (resolve,reject)=>{
						try {
							if (response.finished) return resolve();

							let routepath = path.slice(route.path.length);
							if (route.path.endsWith("*")) routepath = path.slice(route.path.length-1);
							if (route.path.startsWith("*")) routepath = path.slice(0,-route.path.length-1);

							let prom = route.handler(routepath,request,response);
							if (prom instanceof Promise) await prom;
							resolve();
						}
						catch (ex) {
							return reject(ex);
						}
					});
				}));

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	add(method,path,handler) {
		if (method && path && !handler && typeof method==="string" && path instanceof AbstractController) return this.addController(method,path);
		if (method && path && !handler && typeof method==="string" && typeof path==="string") return this.addControllerFile(method,path);
		if (method && !path && !handler && typeof method==="string") return this.addControllerFile(method);

		add.call(this,method,path,handler);

		Log.info("DefaultRouter","Added route "+method+" "+this.fullPath(path));
	}

	remove(method,path,handler) {
		if (method && path && !handler && typeof method==="string" && path instanceof AbstractController) return this.removeController(method,path);
		if (method && path && !handler && typeof method==="string" && typeof path==="string") return this.removeControllerFile(method,path);
		if (method && !path && !handler && typeof method==="string") return this.removeControllerFile(method);

		let found = remove.call(this,method,path,handler);
		if (found) Log.info("DefaultRouter","Removed route "+method+" "+this.fullPath(path));

		return found;
	}

	addController(path,controller) {
		if (!path) throw new Error("Missing path.");
		if (!controller) throw new Error("Missing controller.");
		if (!(controller instanceof AbstractController)) throw new Error("Invalid controller.");

		add.call(this,"*",path,controller.handlerRef);

		Log.info("DefaultRouter","Added controller "+this.fullPath(path));
	}

	removeController(path,controller) {
		if (!path) throw new Error("Missing path.");
		if (controller && !(controller instanceof AbstractController)) throw new Error("Invalid controller.");

		remove.call(this,"*",path,controller && controller.handlerRef || null);

		Log.info("DefaultRouter","Removed controller "+this.fullPath(path));
	}

	addControllerFile(path,filename) {
		if (path && !filename) [path,filename] = ["",path];

		filename = AwesomeUtils.Module.resolve(module,filename);

		if (!filename) throw new Error("Missing filename.");
		if (!AwesomeUtils.FS.existsSync(filename)) return this.addControllerDirectory(path,filename);
		if (FS.statSync(filename).isDirectory()) return this.addControllerDirectory(path,filename);

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
			this.addController(path,instance);
		}
		else if (clazz instanceof AbstractController) {
			this.addController(path,clazz);
		}
		else {
			Log.error("DefaultRouter","Loaded controller does not extend AbstractController "+filename);
			throw new Error("Loaded controller does not extend AbstractController "+filename);
		}
	}

	removeControllerFile(path,filename) {
		if (path && !filename) [path,filename] = ["",path];

		filename = AwesomeUtils.Module.resolve(module,filename);

		if (!filename) throw new Error("Missing filename.");
		if (!AwesomeUtils.FS.existsSync(filename)) return this.removeControllerDirectory(path,filename);
		if (FS.statSync(filename).isDirectory()) return this.removeControllerDirectory(path,filename);

		return this.removeController(path);
	}

	addControllerDirectory(path,dir) {
		if (path && !dir) [path,dir] = ["",path];
		if (!dir) throw new Error("Missing directory "+dir);
		if (typeof path!=="string") throw new Error("Invalid path. addControllerDirectory only support string paths.");

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

			if (stats.isDirectory()) return this.addControllerDirectory(filepath,filename);

			if (ext===".js" || ext===".node") this.addControllerFile(filepath,filename);
		});
	}

	removeControllerDirectory(path,dir) {
		if (path && !dir) [path,dir] = ["",path];
		if (!dir) throw new Error("Missing directory "+dir);
		if (typeof path!=="string") throw new Error("Invalid path. removeControllerDirectory only support string paths.");

		FS.readdirSync(dir).forEach((filename)=>{
			filename = Path.resolve(dir,filename);
			let filepath = (path && path!=="/" && path!=="." && path!==".." ? path+"/" : "")+Path.basename(filename,Path.extname(filename));
			let ext = Path.extname(filename);
			let stats = null;
			try {
				stats = FS.statSync(filename);
			}
			catch (ex) {
				stats = null;
			}
			if (!stats) return;

			if (stats.isDirectory()) return this.removeControllerDirectory(filepath,filename);

			if (ext===".js" || ext===".node") this.removeControllerFile(filepath,filename);
		});
	}

	addServe(path,contentType,filename) {
		if (arguments.length===2) [path,contentType,filename] = [path,null,contentType];

		if (!path) throw new Error("Missing path.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		if (!contentType) contentType = Mime.lookup(filename) || "application/octet-stream";

		filename = AwesomeUtils.Module.resolve(module,filename);

		this.addController(path,new FileServeController(contentType,filename));
	}

	removeServe(path/*,filename*/) {
		if (!path) throw new Error("Missing path.");

		this.removeController(path);
	}

	addServeDirectory(path,dir) {
		if (!path) throw new Error("Missing path.");
		if (!dir) throw new Error("Missing dir.");
		if (typeof dir!=="string") throw new Error("Invalid dir.");

		if (typeof path==="string" && path.endsWith("/*")) path = path.slice(0,-2);

		let controller = new DirectoryServeController(dir);
		this.addController(path,controller);
		this.addController(path+"/".replace(/\/\/+/g,"/"),controller);
		this.addController(path+"/".replace(/\/\/+/g,"/")+"*",controller);
	}

	removeServeDirectory(path,dir) {
		if (!path) throw new Error("Missing path.");
		if (!dir) throw new Error("Missing dir.");
		if (typeof dir!=="string") throw new Error("Invalid dir.");

		if (typeof path==="string" && path.endsWith("/*")) path = path.slice(0,-2);

		this.removeController(path);
		this.removeController(path+"/".replace(/\/\/+/g,"/"));
		this.removeController(path+"/".replace(/\/\/+/g,"/")+"*");
	}

	addPushServe(path,referencePath,contentType,filename) {
		if (arguments.length===3) [path,referencePath,contentType,filename] = [path,referencePath,null,contentType];

		if (!path) throw new Error("Missing path.");
		if (!referencePath) throw new Error("Missing referencePath.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		if (!contentType) contentType = Mime.lookup(filename) || "application/octet-stream";

		filename = AwesomeUtils.Module.resolve(module,filename);

		this.addController(path,new PushServeController(referencePath,contentType,filename));
	}

	removePushServe(path/*,filename*/) {
		if (!path) throw new Error("Missing path.");

		this.removeController(path);
	}

	addRedirect(path,toPath,temporary=false) {
		if (!path) throw new Error("Missing path.");
		if (!toPath) throw new Error("Missing toPath.");
		if (typeof toPath!=="string") throw new Error("Invalid toPath.");

		this.addController(path,new RedirectController(toPath,temporary));
	}

}

const add = function add(method,path,handler) {
	if (!method) method = "*";
	if (!path) throw new Error("Missing path.");
	if (!(typeof path==="string" || path instanceof RegExp)) throw new Error("Invalid path.");
	if (!handler) throw new Error("Missing handler.");
	if (!(handler instanceof Function)) throw new Error("Invalid handler.");

	this.remove(method,path,handler);

	this[$ROUTES].push({
		method,
		path,
		handler
	});
};

const remove = function remove(method,path,handler) {
	if (!method) method = "*";
	if (!path) throw new Error("Missing path.");
	if (!(typeof path==="string" || path instanceof RegExp)) throw new Error("Invalid path.");
	if (handler && !(handler instanceof Function)) throw new Error("Invalid handler.");

	let matching = this[$ROUTES].filter((route)=>{
		if (!route.method) return false;
		if (!(route.method===method || route.method==="*")) return false;
		if (!route.handler) return false;
		if (!(route.handler instanceof Function)) return false;
		if (handler && route.handler!==handler) return false;
		if (route.path instanceof RegExp && !(path instanceof RegExp)) return path.matches(route.path);
		if (route.path instanceof RegExp && path instanceof RegExp) return route.path.toString()===path.toString();
		return route.path===path;
	});
	if (matching.length<1) return false;

	this[$ROUTES] = this[$ROUTES].filter((route)=>{
		return !matching.indexOf(route);
	});
	return true;
};

module.exports = DefaultRouter;

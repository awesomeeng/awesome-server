// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const Log = require("AwesomeLog");
const AwesomeUtils = require("AwesomeUtils");

const AbstractRouter = require('../AbstractRouter');
const AbstractController = require('../AbstractController');

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

	route(request,response) {
		let method = request.method;
		let path = request.url.path;
		if (this.prefix && !path.startsWith(this.prefix)) return Promise.resolve();
		path = path.slice((this.prefix || "").length);

		return new Promise(async (resolve,reject)=>{
			try {
				let matching = this[$ROUTES].filter((route)=>{
					return route.method && (route.method===method || route.method==="*") && route.path && route.path===path && route.handler && route.handler instanceof Function;
				});
				await Promise.all(matching.map((route)=>{
					return new Promise(async (resolve,reject)=>{
						try {
							let prom = route.handler(request,response);
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

		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

		Log.info("DefaultRouter","Added route "+method+" "+path);
	}

	remove(method,path,handler) {
		if (method && path && !handler && typeof method==="string" && path instanceof AbstractController) return this.removeController(method,path);
		if (method && path && !handler && typeof method==="string" && typeof path==="string") return this.removeControllerFile(method,path);
		if (method && !path && !handler && typeof method==="string") return this.removeControllerFile(method);

		let found = remove.call(this,method,path,handler);
		if (found) Log.info("DefaultRouter","Removed route "+method+" "+path);

		return found;
	}

	addController(path,controller) {
		if (!path) throw new Error("Missing path.");
		if (typeof path!=="string") throw new Error("Invalid path.");
		if (!controller) throw new Error("Missing controller.");
		if (!(controller instanceof AbstractController)) throw new Error("Invalid controller.");

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);
		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

		add.call(this,"*",path,controller.handlerRef);

		Log.info("DefaultRouter","Added controller "+path);
	}

	removeController(path,controller) {
		if (!path) throw new Error("Missing path.");
		if (typeof path!=="string") throw new Error("Invalid path.");
		if (controller && !(controller instanceof AbstractController)) throw new Error("Invalid controller.");

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);
		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

		remove.call(this,"*",path,controller && controller.handlerRef || null);

		Log.info("DefaultRouter","Removed controller "+path);
	}

	addControllerFile(path,filename) {
		if (path && !filename) [path,filename] = ["",path];

		filename = AwesomeUtils.Module.resolve(module,filename);

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);
		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

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

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);
		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

		if (!filename) throw new Error("Missing filename.");
		if (!AwesomeUtils.FS.existsSync(filename)) return this.removeControllerDirectory(path,filename);
		if (FS.statSync(filename).isDirectory()) return this.removeControllerDirectory(path,filename);

		return this.removeController(path);
	}

	addControllerDirectory(path,dir) {
		if (path && !dir) [path,dir] = ["",path];
		if (!dir) throw new Error("Missing directory "+dir);

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);
		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

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

			if (stats.isDirectory()) return this.addControllerDirectory(filepath,filename);

			if (ext===".js" || ext===".node") this.addControllerFile(filepath,filename);
		});
	}

	removeControllerDirectory(path,dir) {
		if (path && !dir) [path,dir] = ["",path];
		if (!dir) throw new Error("Missing directory "+dir);

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);
		path = this.prefix+path;
		path = path.replace(/^\/\//g,"/");

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
}

const add = function add(method,path,handler) {
	if (!method) method = "*";
	if (!path) throw new Error("Missing path.");
	if (typeof path!=="string") throw new Error("Invalid path.");
	if (!handler) throw new Error("Missing handler.");
	if (!(handler instanceof Function)) throw new Error("Invalid handler.");

	path = path.replace(/^\/\//g,"/");

	if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);

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
	if (typeof path!=="string") throw new Error("Invalid path.");
	if (handler && !(handler instanceof Function)) throw new Error("Invalid handler.");

	path = path.replace(/^\/\//g,"/");

	if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);

	let hits = 0;
	this[$ROUTES] = this[$ROUTES].filter((route)=>{
		let hit = method===route.method && path===route.path;
		if (hit && handler) hit = hit && handler===route.handler;
		if (hit) hits += 1;
		return !hit;
	});
	return hits>0;
};

module.exports = DefaultRouter;

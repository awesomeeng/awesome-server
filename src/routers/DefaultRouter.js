// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");

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
		if (method && path && !handler && typeof method==="string" && typeof path==="string") return this.addController(method,this.loadController(path));
		if (method && !path && !handler && typeof method==="string") return this.addControllerDirectory(method);

		add.call(this,method,path,handler);

		Log.info("DefaultRouter","Added route "+method+" "+this.prefix+path);
	}

	remove(method,path,handler) {
		if (method && path && !handler && typeof method==="string" && path instanceof AbstractController) return this.removeController(method,path);
		if (method && path && !handler && typeof method==="string" && typeof path==="string") return this.removeController(method,this.loadController(path));
		if (method && !path && !handler && typeof method==="string") return this.removeControllerDirectory(method);

		let found = remove.call(this,method,path,handler);
		if (found) Log.info("DefaultRouter","Removed route "+method+" "+this.prefix+path);

		return found;
	}

	addController(path,controller) {
		if (!path) throw new Error("Missing path.");
		if (typeof path!=="string") throw new Error("Invalid path.");
		if (!controller) throw new Error("Missing controller.");
		if (!(controller instanceof AbstractController)) throw new Error("Invalid controller.");

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);

		add.call(this,"*",path,controller.handlerRef);

		Log.info("DefaultRouter","Added controller "+this.prefix+path);
	}

	removeController(path,controller) {
		if (!path) throw new Error("Missing path.");
		if (typeof path!=="string") throw new Error("Invalid path.");
		if (!controller) throw new Error("Missing controller.");
		if (!(controller instanceof AbstractController)) throw new Error("Invalid controller.");

		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);

		remove.call(this,"*",path,controller.handlerRef);

		Log.info("DefaultRouter","Removed controller "+this.prefix+path);
	}

	addControllerDirectory(directory) {

	}

	removeControllerDirectory(directory) {

	}

	loadController(filename) {

	}
}

const add = function add(method,path,handler) {
	if (!method) method = "*";
	if (!path) throw new Error("Missing path.");
	if (typeof path!=="string") throw new Error("Invalid path.");
	if (!handler) throw new Error("Missing handler.");
	if (!(handler instanceof Function)) throw new Error("Invalid handler.");

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
	if (!handler) throw new Error("Missing handler.");
	if (!(handler instanceof Function)) throw new Error("Invalid handler.");

	let hits = 0;
	this[$ROUTES] = this[$ROUTES].filter((route)=>{
		let nothit = method!==route.method || path!==route.path;
		if (nothit===false && handler) nothit = handler!==route.handler;
		if (nothit) hits += 1;
		return nothit;
	});
	return hits>0;
};

module.exports = DefaultRouter;

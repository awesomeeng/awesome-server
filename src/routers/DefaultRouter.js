// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");

const AbstractRouter = require('../AbstractRouter');

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
		if (this.prefix && path.startsWith(this.prefix)) path = path.slice(this.prefix.length);

		this.remove(method,path,handler);
		this[$ROUTES].push({
			method,
			path,
			handler
		});

		Log.info("DefaultRouter","Added route "+method+" "+this.prefix+path);
	}

	remove(method,path,handler) {
		let hits = 0;
		this[$ROUTES] = this[$ROUTES].filter((route)=>{
			let nothit = method!==route.method || path!==route.path || handler!==route.handler;
			if (nothit) hits += 1;
			return nothit;
		});
		if (hits) Log.info("DefaultRouter","Removed route "+method+" "+this.prefix+path);
	}
}

module.exports = DefaultRouter;

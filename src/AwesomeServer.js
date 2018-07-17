// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");

const AbstractServer = require("./AbstractServer");
const HTTPServer = require("./http/HTTPServer");

const AbstractRouter = require("./AbstractRouter");

const $SERVERS = Symbol("servers");
const $ROUTER = Symbol("router");

class AwesomeServer {
	constructor() {
		this[$SERVERS] = new Set();
		this[$ROUTER] = null;
	}

	get AbstractServer() {
		return AbstractServer;
	}

	get AbstractRouter() {
		return AbstractRouter;
	}

	get servers() {
		return [].concat(this[$SERVERS]);
	}

	get router() {
		return this[$ROUTER];
	}

	set router(router) {
		if (!router) throw new Error("Missing router.");
		if (!(router instanceof AbstractRouter)) throw new Error("Invalid router.");

		this[$ROUTER] = router;
	}

	async start() {
		Log.info("AwesomeServer","Starting...");

		if (this[$SERVERS].size<1) {
			Log.warn("AwesomeServer","No servers defined. Nothing to do.");
		}
		else {
			await Promise.all([...this[$SERVERS]].map((server)=>{
				let prom = server.start();
				if (prom instanceof Promise) return prom;
				return Promise.resolve();
			}));
		}

		Log.info("AwesomeServer","Started.");
	}

	async stop() {
		Log.info("AwesomeServer","Stopping...");

		await Promise.all([...this[$SERVERS]].map((server)=>{
			let prom = server.stop();
			if (prom instanceof Promise) return prom;
			return Promise.resolve();
		}));

		Log.info("AwesomeServer","Stopped.");
	}

	addServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		this[$SERVERS].add(server);
	}

	addHTTPServer(config) {
		let server = new HTTPServer(config);
		this.addServer(server);
	}

	addHTTPSServer(config) {

	}

	removeServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		this[$SERVERS].delete(server);
	}



}

module.exports = AwesomeServer;

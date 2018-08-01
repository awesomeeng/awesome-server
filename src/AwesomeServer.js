// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");

const AbstractServer = require("./AbstractServer");
const AbstractRequest = require("./AbstractRequest");
const AbstractResponse = require("./AbstractResponse");
const AbstractController = require("./AbstractController");

const AbstractRouter = require("./AbstractRouter");
const DefaultRouter = require("./routers/DefaultRouter");

const $SERVERS = Symbol("servers");
const $ROUTER = Symbol("router");

class AwesomeServer {
	constructor() {
		this[$SERVERS] = new Set();
		this[$ROUTER] = new DefaultRouter();
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

	static get AbstractRouter() {
		return AbstractRouter;
	}

	static get DefaultRouter() {
		return DefaultRouter;
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
				let prom = server.start(this.handler.bind(this));
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
	}

	async handler(request,response) {
		if (!request) throw new Error("Missing request.");
		if (!(request instanceof AbstractRequest)) throw new Error("Invalid request.");
		if (!response) throw new Error("Missing response.");
		if (!(response instanceof AbstractResponse)) throw new Error("Invalid response.");

		let url = request.method+" "+(request.url && request.url.href || request.url && request.url.toString() || request.url.toString());

		Log.access("AwesomeServer","Request "+url+" from "+request.origin+".");

		try {
			if (this[$ROUTER] && this[$ROUTER].route) await this[$ROUTER].route(request,response);
		}
		catch (ex) {
			Log.error("AwesomeServer","Error handling request "+url+".",ex);
			response.writeError(500,"Error handling request "+url+".");
			return;
		}

		if (!response.finished) {
			Log.error("AwesomeServer","404 Not found "+url+".");
			response.writeError(404,"404 Not found "+url+".");
		}
	}
}


module.exports = AwesomeServer;

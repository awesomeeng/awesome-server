// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP = require("http");

const Log = require("AwesomeLog");

const AbstractServer = require("../AbstractServer");
const HTTPRequest = require("./HTTPRequest");
const HTTPResponse = require("./HTTPResponse");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");
const $CONFIG = Symbol("config");

class HTTPServer extends AbstractServer {
	constructor(config) {
		super();

		this[$CONFIG] = Object.assign({
			hostname: "localhost",
			port: 7080
		},config);
	}

	get running() {
		return this[$SERVER] && this[$RUNNING];
	}

	get config() {
		return this[$CONFIG];
	}

	get underlying() {
		return this[$SERVER];
	}

	start() {
		if (this[$SERVER]) return Promise.resolve();

		let hostname = this.config.hostname || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info("HTTPServer","Starting HTTP Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = HTTP.createServer();

				server.on("error",(err)=>{
					Log.error("HTTPServer","Error on HTTP Server on "+hostname+":"+port+":",err);
				});

				server.on("request",this.handleRequest);

				server.listen(this.config.port,this.config.hostname,this.config.backlog,(err)=>{
					if (err) {
						Log.error("HTTPServer","Error starting server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTPServer","Started HTTP Server on "+hostname+":"+port+"...");
						this[$RUNNING] = false;
						this[$SERVER] = null;
						resolve();
					}
				});

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	stop() {
		if (!this[$SERVER]) return Promise.resolve();

		let hostname = this.config.hostname || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info("HTTPServer","Stopping HTTP Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = HTTP.createServer();
				server.listen(this.config.port,this.config.hostname,this.config.backlog,(err)=>{
					if (err) {
						Log.error("HTTPServer","Error stopping server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTPServer","Stopped HTTP Server on "+hostname+":"+port+"...");
						this[$RUNNING] = false;
						this[$SERVER] = null;
						resolve();
					}
				});

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	handleRequest(request,response) {
		request = new HTTPRequest(request);
		response = new HTTPResponse(response);
	}
}

module.exports = HTTPServer;

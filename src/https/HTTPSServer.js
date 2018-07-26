// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPS = require("https");

const Log = require("AwesomeLog");

const HTTPServer = require("../http/HTTPServer");
const HTTPSRequest = require("./HTTPSRequest");
const HTTPSResponse = require("./HTTPSResponse");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

class HTTPSServer extends HTTPServer {
	constructor(config) {
		super(Object.assign({
			hostname: "localhost",
			port: 7080
		},config));
	}

	get running() {
		return this[$SERVER] && this[$RUNNING];
	}

	get original() {
		return this[$SERVER];
	}

	start(handler) {
		if (this[$SERVER]) return Promise.resolve();

		let hostname = this.config.hostname || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info("HTTPSServer","Starting HTTPS Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = HTTPS.createServer(this.config);

				server.on("error",(err)=>{
					Log.error("HTTPSServer","Error on HTTPS Server on "+hostname+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.listen(this.config.port,this.config.hostname,this.config.backlog,(err)=>{
					if (err) {
						Log.error("HTTPSServer","Error starting server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTPSServer","Started HTTPS Server on "+hostname+":"+port+"...");
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

		Log.info("HTTPSServer","Stopping HTTPS Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = this[$SERVER];
				server.close((err)=>{
					if (err) {
						Log.error("HTTPSServer","Error stopping HTTPS server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTPSServer","Stopped HTTPS Server on "+hostname+":"+port+"...");
						this[$RUNNING] = false;
						this[$SERVER] = null;
						resolve();
					}
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	handleRequest(handler,request,response) {
		request = new HTTPSRequest(request);
		response = new HTTPSResponse(response);
		handler(request,response);
	}
}

module.exports = HTTPSServer;

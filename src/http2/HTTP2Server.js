// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP2 = require("http2");

const Log = require("AwesomeLog");

const HTTPSServer = require("../https/HTTPSServer");
const HTTP2Request = require("./HTTP2Request");
const HTTP2Response = require("./HTTP2Response");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

class HTTP2Server extends HTTPSServer {
	constructor(config) {
		super(Object.assign({
			hostname: "localhost",
			port: 7080,
			allowHTTP1: true
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

		Log.info("HTTP2Server","Starting HTTP/2 Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {

				this.config.cert = HTTPSServer.resolveCertConfig(this.config.cert,"cert","HTTP2Server");
				this.config.key = HTTPSServer.resolveCertConfig(this.config.key,"key","HTTP2Server");
				this.config.pfx = HTTPSServer.resolveCertConfig(this.config.pfx,"pfx","HTTP2Server");

				let server = HTTP2.createSecureServer(this.config);

				server.on("error",(err)=>{
					Log.error("HTTP2Server","Error on HTTP/2 Server on "+hostname+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.listen(this.config.port,this.config.hostname,this.config.backlog,(err)=>{
					if (err) {
						Log.error("HTTP2Server","Error starting server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTP2Server","Started HTTP/2 Server on "+hostname+":"+port+"...");
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

		Log.info("HTTP2Server","Stopping HTTP/2 Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = this[$SERVER];
				server.close((err)=>{
					if (err) {
						Log.error("HTTP2Server","Error stopping HTTP/2 server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTP2Server","Stopped HTTP/2 Server on "+hostname+":"+port+"...");
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
		let req = new HTTP2Request(request,response);
		let resp = new HTTP2Response(request,response);
		handler(req,resp);
	}
}

module.exports = HTTP2Server;

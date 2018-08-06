// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPS = require("https");
const FS = require("fs");
const Path = require("path");

const Log = require("AwesomeLog");
const AwesomeUtils = require("AwesomeUtils");

const HTTPServer = require("../http/HTTPServer");
const HTTPSRequest = require("./HTTPSRequest");
const HTTPSResponse = require("./HTTPSResponse");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

class HTTPSServer extends HTTPServer {
	constructor(config) {
		super(Object.assign({
			host: "localhost",
			port: 7080
		},config));

		this[$SERVER] = null;
		this[$RUNNING] = false;
	}

	get running() {
		return this[$SERVER] && this[$RUNNING];
	}

	get original() {
		return this[$SERVER];
	}

	start(handler) {
		if (this[$SERVER]) return Promise.resolve();

		let host = this.config.host || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info("HTTPSServer","Starting HTTPS Server on "+host+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				this.config.cert = HTTPSServer.resolveCertConfig(this.config.cert,"cert");
				this.config.key = HTTPSServer.resolveCertConfig(this.config.key,"key");
				this.config.pfx = HTTPSServer.resolveCertConfig(this.config.pfx,"pfx");

				let server = HTTPS.createServer(this.config);

				server.on("error",(err)=>{
					Log.error("HTTPSServer","Error on HTTPS Server on "+host+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.listen(this.config.port,this.config.host,this.config.backlog,(err)=>{
					if (err) {
						Log.error("HTTPSServer","Error starting server on "+host+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTPSServer","Started HTTPS Server on "+host+":"+port+"...");
						this[$RUNNING] = true;
						this[$SERVER] = server;

						resolve();
					}
				});

			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	stop() {
		if (!this[$SERVER]) return Promise.resolve();

		let host = this.config.host || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info("HTTPSServer","Stopping HTTPS Server on "+host+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = this[$SERVER];
				server.close((err)=>{
					if (err) {
						Log.error("HTTPSServer","Error stopping HTTPS server on "+host+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTPSServer","Stopped HTTPS Server on "+host+":"+port+"...");
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

	static resolveCertConfig(value,type="certificate",parentName="HTTPSServer") {
		if (value && typeof value==="string" && !value.startsWith("----")) {
			let filename = Path.resolve(process.cwd(),value);
			Log.info(parentName,"Loading "+type+" from "+filename+".");

			if (AwesomeUtils.FS.existsSync(filename)) {
				try {
					let pfx = FS.readFileSync(filename);
					if (!pfx) throw new Error(type+" file empty: "+filename+".");
					value = pfx;
				}
				catch (ex) {
					Log.error(parentName,"Error reading "+type+" from "+filename+".",ex);
				}
			}
			else {
				Log.info(parentName,type+" file not found: "+filename+".");
			}
		}
		else  if (value) {
			Log.info(parentName,"Using passed contents for "+type+" value.");
		}

		return value;
	}
}

module.exports = HTTPSServer;

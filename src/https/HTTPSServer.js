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

/**
 * HTTPS implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTPSServer() is used. This is basically a
 * wrapper around nodejs' https module.
 *
 * @extends AbstractServer
 */
class HTTPSServer extends HTTPServer {
	/**
	 * Adds a new HTTPS Server to the AwesomeServer instance. The HTTPS Server is
	 * a wrapped version of nodejs's *https* module and thus behaves as that
	 * module behaves, with some slight differences.  Each request that comes
	 * through will have its request and response objects wrapped in AwesomeServer's
	 * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
	 * cleaner access layer to the underlying request or response. See AbstractRequest
	 * and AbstractResponse for more details.
	 *
	 * Takes a *config* object as an argument that is passed to the underlying HTTPS
	 * module.  The basic structure of this config is below with the default values shown:
	 *
	 * ```
	 * const config = {
	 *   host: "localhost"
	 *   port: 7080,
	 *   key: null,
	 *   cert: null,
	 *   pfx: null
	 * };
	 * ```
	 *
	 * *key*, *cert*, and *pfx* are handled specially in AwesomeServer. You may supply
	 * a string representing the certificate or a string representing a valid path
	 * to a file containing the certificate. AwesomeServer will attempt to load
	 * the file and if successful use that as the value.
	 *
	 * For more details about config values, please see [nodejs' *https* module]()
	 *
	 * **An important note about config**: The default *host* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs *https* module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	constructor(config) {
		super(Object.assign({
			host: "localhost",
			port: 7080
		},config));

		this[$SERVER] = null;
		this[$RUNNING] = false;
	}

	/**
	 * Returns true if this server is started.
	 *
	 * @return {boolean}
	 */
	get running() {
		return this[$SERVER] && this[$RUNNING];
	}

	/**
	* Returns the underlying, wrapped, nodejs https server.
	*
	* @return {*}
	*/
	get original() {
		return this[$SERVER];
	}

	/**
	* Starts this server running and accepting requests. This effectively
	* creates the nodejs https server, and begins the listening process,
	* routing incoming requests to the provided handler.
	*
	* AwesomeServer will call this method when AwesomeServer is started
	* and provides the handler it wants used for incoming requests.
	*
	* This function returns a Promise that will resolve when the server
	* has started listening, or rejects if there is an error.
	*
	* @param  {Function} handler
	* @return {Promise}
	*/
	start(handler) {
		if (this[$SERVER]) return Promise.resolve();

		let host = this.config.host || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info && Log.info("HTTPSServer","Starting HTTPS Server on "+host+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				this.config.cert = HTTPSServer.resolveCertConfig(this.config.cert,"cert");
				this.config.key = HTTPSServer.resolveCertConfig(this.config.key,"key");
				this.config.pfx = HTTPSServer.resolveCertConfig(this.config.pfx,"pfx");

				let server = HTTPS.createServer(this.config);

				server.on("error",(err)=>{
					Log.info && Log.error("HTTPSServer","Error on HTTPS Server on "+host+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.listen(this.config.port,this.config.host,this.config.backlog,(err)=>{
					if (err) {
						Log.info && Log.error("HTTPSServer","Error starting server on "+host+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info && Log.info("HTTPSServer","Started HTTPS Server on "+host+":"+port+"...");
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

	/**
	 * Stops the server running.
	 *
	 * Returns a Promise that will resolve when the underlying server
	 * has stopped.
	 *
	 * @return {Promise}
	 */
	stop() {
		if (!this[$SERVER]) return Promise.resolve();

		let host = this.config.host || "127.0.0.1";
		let port = this.config.port || 0;

		Log.info && Log.info("HTTPSServer","Stopping HTTPS Server on "+host+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = this[$SERVER];
				server.close((err)=>{
					if (err) {
						Log.info && Log.error("HTTPSServer","Error stopping HTTPS server on "+host+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info && Log.info("HTTPSServer","Stopped HTTPS Server on "+host+":"+port+"...");
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

	/**
	 * A wrapper function for the handler called by the underlying server
	 * when a new request occurs. This handler is responsible for wrapping
	 * the incoming request's request object and response object in a
	 * HTTPSRequest and HTTPSResponse respectively. Finally, it calls
	 * the handler AwesomeServer provided when it started the server.
	 *
	 * @param  {Function} handler
	 * @param  {*} request
	 * @param  {*} response
	 */
	handleRequest(handler,request,response) {
		request = new HTTPSRequest(request);
		response = new HTTPSResponse(response);
		handler(request,response);
	}

	/**
	 * Static utility function for loading a certificate from a file system
	 * or treating the passed string as the certificate.
	 *
	 * @param  {[type]} value                      [description]
	 * @param  {String} [type="certificate"]       [description]
	 * @param  {String} [parentName="HTTPSServer"] [description]
	 * @return {[type]}                            [description]
	 */
	static resolveCertConfig(value,type="certificate",parentName="HTTPSServer") {
		if (value && typeof value==="string" && !value.startsWith("----")) {
			let filename = Path.resolve(process.cwd(),value);
			Log.info && Log.info(parentName,"Loading "+type+" from "+filename+".");

			if (AwesomeUtils.FS.existsSync(filename)) {
				try {
					let pfx = FS.readFileSync(filename);
					if (!pfx) throw new Error(type+" file empty: "+filename+".");
					value = pfx;
				}
				catch (ex) {
					Log.info && Log.error(parentName,"Error reading "+type+" from "+filename+".",ex);
				}
			}
			else {
				Log.info && Log.info(parentName,type+" file not found: "+filename+".");
			}
		}
		else  if (value) {
			Log.info && Log.info(parentName,"Using passed contents for "+type+" value.");
		}

		return value;
	}
}

module.exports = HTTPSServer;

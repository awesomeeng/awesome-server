// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP = require("http");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("@awesomeeng/awesome-log");

const AbstractServer = require("../AbstractServer");
const HTTPRequest = require("./HTTPRequest");
const HTTPResponse = require("./HTTPResponse");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

/**
 * HTTP implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTPServer() is used. This is basically a
 * wrapper around nodejs' http module.
 *
 * @extends AbstractServer
 */
class HTTPServer extends AbstractServer {
	/**
	* Creates a new HTTP Server to the AwesomeServer instance. The HTTP Server is
	* a wrapped version of nodejs's *http* module and thus behaves as that
	* module behaves, with some slight differences.  Each request that comes
	* through will have its request and response objects wrapped in AwesomeServer's
	* custom HTTPRequest and HTTPResponse objects. The provide a simplified but
	* cleaner access layer to the underlying request or response. See AbstractRequest
	* and AbstractResponse for more details.
	*
	* Takes a *config* object as an argument that is passed to the underlying HTTP
	* module.  The basic structure of this config is below with the default values shown:
	*
	* ```
	* const config = {
	*   hostname: "localhost"
	*   port: 0
	* };
	* ```
	* For more details about config values, please see [nodejs' http module]()
	*
	* **An important note about config**: The default *hostname* setting for AwesomeServer
	* is `localhost`. This is different than the default for the underlying
	* nodejs http module of `0.0.0.0`.
	*
	* @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	*
	* @return {AbstractServer}        the server added.
	 */
	constructor(config) {
		super(AwesomeUtils.Object.extend({
			hostname: "localhost",
			port: 0
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
	 * Returns the underlying, wrapped, nodejs http server.
	 *
	 * @return {*}
	 */
	get original() {
		return this[$SERVER];
	}

	/**
	 * Returns the bound hostname for this server.
	 *
	 * @return {string}
	 */
	get hostname() {
		return this.original && this.original.address() && this.original.address().address || this.config.hostname || this.config.host || "localhost";
	}

	/**
	 * Returns the bound port for this server.
	 *
	 * @return {number}
	 */
	get port() {
		return this.original && this.original.address() && this.original.address().port || this.config.port || 0;
	}

	/**
	 * Starts this server running and accepting requests. This effectively
	 * creates the nodejs http server, and begins the listening process,
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

		let hostname = this.config.hostname || this.config.host || "localhost";
		let port = this.config.port || 0;

		Log.info("Starting HTTP Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = HTTP.createServer(this.config);

				server.on("error",(err)=>{
					Log.error("Error on HTTP Server on "+hostname+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.listen(port,hostname,this.config.backlog,(err)=>{
					if (err) {
						Log.error("Error starting server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("Started HTTP Server on "+this.hostname+":"+this.port+"...");
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

		let hostname = this.hostname || "localhost";
		let port = this.port || 0;

		Log.info("Stopping HTTP Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = this[$SERVER];
				server.close((err)=>{
					if (err) {
						Log.error("Error stopping HTTP server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("Stopped HTTP Server on "+hostname+":"+port+"...");
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
	 * HTTPRequest and HTTPResponse respectively. Finally, it calls
	 * the handler AwesomeServer provided when it started the server.
	 *
	 * @param  {Function} handler
	 * @param  {*} request
	 * @param  {*} response
	 */
	handleRequest(handler,request,response) {
		request = new HTTPRequest(request);
		response = new HTTPResponse(response);
		handler(request,response);
	}
}

module.exports = HTTPServer;

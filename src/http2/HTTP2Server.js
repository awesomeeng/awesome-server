// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP2 = require("http2");

const Log = require("AwesomeLog");

const HTTPSServer = require("../https/HTTPSServer");
const HTTP2Request = require("./HTTP2Request");
const HTTP2Response = require("./HTTP2Response");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

/**
 * HTTP/2 implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTP2Server() is used. This is basically a
 * wrapper around nodejs' http2 module.
 *
 * @extends AbstractServer
 */
class HTTP2Server extends HTTPSServer {
	/**
	 * Adds a new HTTP/2 Server to the AwesomeServer instance. The HTTP/2 Server is
	 * a wrapped version of nodejs's *http2* module and thus behaves as that
	 * module behaves, with some slight differences.  Each request that comes
	 * through will have its request and response objects wrapped in AwesomeServer's
	 * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
	 * cleaner access layer to the underlying request or response. See AbstractRequest
	 * and AbstractResponse for more details.
	 *
	 * Takes a *config* object as an argument that is passed to the underlying HTTP/2
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
	 * For more details about config values, please see [nodejs' *http2* module]()
	 *
	 * **An important note about config**: The default *host* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs *http2* module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	constructor(config) {
		super(Object.assign({
			host: "localhost",
			port: 7080,
			allowHTTP1: true
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
	 * Returns the underlying, wrapped, nodejs http2 server.
	 *
	 * @return {*}
	 */
	get original() {
		return this[$SERVER];
	}

	/**
	 * Starts this server running and accepting requests. This effectively
	 * creates the nodejs http2 server, and begins the listening process,
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

		Log.info("HTTP2Server","Starting HTTP/2 Server on "+host+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {

				this.config.cert = HTTPSServer.resolveCertConfig(this.config.cert,"cert","HTTP2Server");
				this.config.key = HTTPSServer.resolveCertConfig(this.config.key,"key","HTTP2Server");
				this.config.pfx = HTTPSServer.resolveCertConfig(this.config.pfx,"pfx","HTTP2Server");

				let server = HTTP2.createSecureServer(this.config);

				server.on("error",(err)=>{
					Log.error("HTTP2Server","Error on HTTP/2 Server on "+host+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.listen(this.config.port,this.config.host,this.config.backlog,(err)=>{
					if (err) {
						Log.error("HTTP2Server","Error starting server on "+host+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTP2Server","Started HTTP/2 Server on "+host+":"+port+"...");
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

		Log.info("HTTP2Server","Stopping HTTP/2 Server on "+host+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {
				let server = this[$SERVER];
				server.close((err)=>{
					if (err) {
						Log.error("HTTP2Server","Error stopping HTTP/2 server on "+host+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						Log.info("HTTP2Server","Stopped HTTP/2 Server on "+host+":"+port+"...");
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
	 * HTTP2Request and HTTP2Response respectively. Finally, it calls
	 * the handler AwesomeServer provided when it started the server.
	 *
	 * @param  {Function} handler
	 * @param  {*} request
	 * @param  {*} response
	 */
	handleRequest(handler,request,response) {
		let req = new HTTP2Request(request,response);
		let resp = new HTTP2Response(request,response);
		handler(req,resp);
	}
}

module.exports = HTTP2Server;

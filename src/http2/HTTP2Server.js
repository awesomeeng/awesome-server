// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP2 = require("http2");
const FS = require("fs");
const Path = require("path");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("@awesomeeng/awesome-log");

const HTTPSServer = require("../https/HTTPSServer");
const HTTP2Request = require("./HTTP2Request");
const HTTP2Response = require("./HTTP2Response");

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");
const $SESSIONS = Symbol("sessions");
const $CONNECTIONS = Symbol("connections");

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
	 *   hostname: "localhost"
	 *   port: 0,
	 *   key: null,
	 *   cert: null,
	 *   pfx: null,
	 *   informative: true
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
	 * **An important note about config**: The default *hostname* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs *http2* module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	constructor(config) {
		super(AwesomeUtils.Object.extend({
			hostname: "localhost",
			port: 0,
			allowHTTP1: true,
			informative: true
		},config));

		this[$SERVER] = null;
		this[$RUNNING] = false;
		this[$SESSIONS] = [];
		this[$CONNECTIONS] = [];
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

		this[$SESSIONS] = [];

		let hostname = this.config.hostname || this.config.host || "localhost";
		let port = this.config.port || 0;

		if (this.config.informative) Log.info("Starting HTTP/2 Server on "+hostname+":"+port+"...");
		return new Promise((resolve,reject)=>{
			try {

				this.config.cert = HTTP2Server.resolveCertConfig(this.config.cert,"cert",this.config.informative);
				this.config.key = HTTP2Server.resolveCertConfig(this.config.key,"key",this.config.informative);
				this.config.pfx = HTTP2Server.resolveCertConfig(this.config.pfx,"pfx",this.config.informative);

				let server = HTTP2.createSecureServer(this.config);

				server.on("error",(err)=>{
					Log.error("Error on HTTP/2 Server on "+hostname+":"+port+":",err);
				});

				server.on("request",this.handleRequest.bind(this,handler));

				server.on("session",(session)=>{
					this[$SESSIONS].push(session);
					session.on("close",()=>{
						this[$SESSIONS] = this[$SESSIONS].filter((ses)=>{
							return ses!==session;
						});
					});
				});

				server.on("connection",(connection)=>{
					this[$CONNECTIONS].push(connection);
					connection.on("close",()=>{
						this[$CONNECTIONS] = this[$CONNECTIONS].filter((ses)=>{
							return ses!==connection;
						});
					});
				});

				server.on("secureConnection",(connection)=>{
					this[$CONNECTIONS].push(connection);
					connection.on("close",()=>{
						this[$CONNECTIONS] = this[$CONNECTIONS].filter((ses)=>{
							return ses!==connection;
						});
					});
				});

				server.listen(port,hostname,this.config.backlog,(err)=>{
					if (err) {
						Log.error("Error starting server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						if (this.config.informative) Log.info("Started HTTP/2 Server on "+this.hostname+":"+this.port+"...");
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

		if (this.config.informative) Log.info("Stopping HTTP/2 Server on "+hostname+":"+port+"...");
		return new Promise(async (resolve,reject)=>{
			try {
				let server = this[$SERVER];

				await Promise.all(this[$SESSIONS].map((session)=>{
					return new Promise((resolve,reject)=>{
						try {
							session.close(()=>{
								resolve();
							});
						}
						catch (ex) {
							return reject(ex);
						}
					});
				}));
				this[$CONNECTIONS].map((connection)=>{
					connection.destroy();
				});

				server.close((err)=>{
					if (err) {
						Log.error("Error stopping HTTP/2 server on "+hostname+":"+port+".",err);
						this[$RUNNING] = false;
						this[$SERVER] = null;
						reject(err);
					}
					else {
						if (this.config.informative) Log.info("Stopped HTTP/2 Server on "+hostname+":"+port+"...");
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

	/**
	 * Static utility function for loading a certificate from a file system
	 * or treating the passed string as the certificate.
	 *
	 * @param  {string|buffer} value
	 * @param  {string} [type="certificate"]
	 * @return {string}
	 */
	static resolveCertConfig(value,type="certificate",informative=true) {
		if (value && typeof value==="string" && !value.startsWith("----")) {
			let filename = Path.resolve(process.cwd(),value);
			if (informative) Log.info("Loading "+type+" from "+filename+".");

			if (AwesomeUtils.FS.existsSync(filename)) {
				try {
					let pfx = FS.readFileSync(filename);
					if (!pfx) throw new Error(type+" file empty: "+filename+".");
					value = pfx;
				}
				catch (ex) {
					Log.error("Error reading "+type+" from "+filename+".",ex);
				}
			}
			else {
				Log.error(type+" file not found: "+filename+".");
			}
		}
		else if (value) {
			if (informative) Log.info("Using passed contents for "+type+" value.");
		}

		return value;
	}
}

module.exports = HTTP2Server;

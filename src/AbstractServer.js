// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $CONFIG = Symbol("config");

/**
 * Describes the required shape of a server used by AwesomeServer.
 *
 * The following functions are required to be implemented by
 * extending classes:
 *
 * 		get running()
 * 		get original()
 * 		start()
 * 		stop()
 */
class AbstractServer {
	/**
	 * Constructor. Takes a single config object which is in turn usually passed
	 * on to the underlying server that this AbstractServer represents.
	 *
	 * @param {(AwesomeConfig|Object)} config The config object.
	 */
	constructor(config) {
		this[$CONFIG] = config;
	}

	/**
	 * Returns the passed in config object.
	 * @return {(AwesomeConfig|Object)}
	 */
	get config() {
		return this[$CONFIG];
	}

	/**
	 * Returns true if this server has been started.
	 * @return {boolean}
	 */
	get running() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Returns the underlying server object that this AbstractServer represents.
	 * @return {*}
	 */
	get original() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Start this server running and being sending incoming requests to the given handler.
	 *
	 * This start function gets a single argument, the handler function that incoming
	 * requests should be sent to.  It is the job of this server to take the
	 * incoming requests, wrap the request object in an AbstractRequest subclass,
	 * wrap the response object in an AbstractResponse subclass, and then send both
	 * of those to the handler for processing.
	 *
	 * Here's an example from HTTPServer:
	 *
	 * 		server.on("request",(request,response)=>{
	 * 			request = new HTTPRequest(request);
	 * 			response = new HTTPResponse(response);
	 * 			handler(request,response);
	 * 		});
	 *
	 * Start must return a Promise that resolves when the underlying server is started
	 * or rejects on an error.
	 *
	 * It is the responsibility of the AbstractServer implementor to keep track of the
	 * underlying server object.
	 *
	 * @param  {Function} handler
	 * @return {Promise}
	 */
	start(/*handler*/) {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Stop this server running and stop sending incoming requests to AwesomeServer.
	 *
	 * Stop must return a Promise that resolves when the underlying server is stopped
	 * or rejects on an error.
	 *
	 * @return {Promise}
	 */
	stop() {
		throw new Error("To be implemented by subclass.");
	}
}

module.exports = AbstractServer;

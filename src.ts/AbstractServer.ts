// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { AwesomeConfig } from './types';

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
export abstract class AbstractServer {
	private [$CONFIG]: AwesomeConfig;

	/**
	 * Constructor. Takes a single config object which is in turn usually passed
	 * on to the underlying server that this AbstractServer represents.
	 *
	 * @param {AwesomeConfig} config The config object.
	 */
	constructor(config: AwesomeConfig) {
		this[$CONFIG] = config;
	}

	/**
	 * Returns the passed in config object.
	 *
	 * @return {AwesomeConfig}
	 */
	get config(): AwesomeConfig {
		return this[$CONFIG];
	}

	/**
	 * Returns true if this server has been started.
	 *
	 * @return {boolean}
	 */
	abstract get running(): boolean;

	/**
	 * Returns the underlying server object that this AbstractServer represents.
	 *
	 * @return {unknown}
	 */
	abstract get original(): unknown;

	/**
	 * Returns the bound hostname for this server.
	 *
	 * @return {string} 
	 */
	abstract get hostname(): string;

	/**
	 * Returns the bound port for this server.
	 *
	 * @return {number}
	 */
	abstract get port(): number;

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
	 * @return {Promise<void>}
	 */
	abstract start(handler: (request: unknown, response: unknown) => void): Promise<void>;

	/**
	 * Stop the underlying server. Returns a Promise that resolves when the server
	 * is stopped, or rejects on error.
	 *
	 * @return {Promise<void>}
	 */
	abstract stop(): Promise<void>;
}

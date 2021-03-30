// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");
const FS = require("fs");

const Log = require("@awesomeeng/awesome-log");
// Log.start();

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractServer = require("./AbstractServer");
const AbstractRequest = require("./AbstractRequest");
const AbstractResponse = require("./AbstractResponse");
const AbstractController = require("./AbstractController");

const AbstractPathMatcher = require("./AbstractPathMatcher");

const FileServeController = require("./controllers/FileServeController");
const DirectoryServeController = require("./controllers/DirectoryServeController");
const PushServeController = require("./controllers/PushServeController");
const RedirectController = require("./controllers/RedirectController");

const $CONFIG = Symbol("config");
const $SERVERS = Symbol("servers");
const $ROUTES = Symbol("routes");
const $RUNNING = Symbol("running");

/**
 * AwesomeServer is a customizable API Server framework for enterprise nodejs
 * applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
 * provide flexible routing and controllers for responding to incoming requests in a
 * consistent, repeatable fashion.
 *
 * Please see the documentation at @link https://github.com/awesomeeng/AwesomeServer.
 */
class AwesomeServer {
	/**
	 * Creates a new AwesomeServer instance.
	 *
	 * You may create multiple AwesomeServer instances and do different things with them.
	 *
	 * Takes an optional config object for passing in configuration about the overall
	 * AwesomeServer instance.  This is not the same as the config provided to each
	 * server when it is constructed/added via addHTTPServer(config) and the like.
	 * Those configs are separate.
	 *
	 * The default configuration looks like this:
	 *
	 * 	 config = {
	 * 	 	informative: true
	 * 	 }
	 *
	 * 	 config.informative - If true, log statements are provided for how AwesomeServer
	 * 	 is executing. If false, no log statements are output. Error and warning
	 * 	 log message are always output.
	 *
	 * @constructor
	 *
	 */
	constructor(config={}) {
		config = AwesomeUtils.Object.extend({
			informative: true
		},config);
		this[$CONFIG] = config;

		this[$RUNNING] = false;
		this[$SERVERS] = new Set();
		this[$ROUTES] = [];
	}

	/**
	 * Returns a reference to the AbstractServer class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractServer() {
		return AbstractServer;
	}

	/**
	 * Returns a reference to the AbstractRequest class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractRequest() {
		return AbstractRequest;
	}

	/**
	 * Returns a reference to the AbstractResponse class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractResponse() {
		return AbstractResponse;
	}

	/**
	 * Returns a reference to the AbstractController class for custom extensions.
	 *
	 * @return Class
	 */
	static get AbstractController() {
		return AbstractController;
	}

	/**
	 * Returns a reference to the AbstractPathMatcher class for custom extensions.
	 */
	static get AbstractPathMatcher() {
		return AbstractPathMatcher;
	}

	/**
	 * Returns references to HTTPServer, HTTPRequest, and HTTPResponse for custom extensions.
	 */
	static get http() {
		return {
			HTTPServer: require("./http/HTTPServer"),
			HTTPRequest: require("./http/HTTPRequest"),
			HTTPResponse: require("./http/HTTPResponse")
		};
	}

	/**
	 * Returns references to HTTPSServer, HTTPSRequest, and HTTPSResponse for custom extensions.
	 */
	static get https() {
		return {
			HTTPSServer: require("./https/HTTPSServer"),
			HTTPSRequest: require("./https/HTTPSRequest"),
			HTTPSResponse: require("./https/HTTPSResponse")
		};
	}

	/**
	 * Returns references to HTTP2Server, HTTP2Request, and HTTP2Response for custom extensions.
	 */
	static get http2() {
		return {
			HTTP2Server: require("./http2/HTTP2Server"),
			HTTP2Request: require("./http2/HTTP2Request"),
			HTTP2Response: require("./http2/HTTP2Response")
		};
	}

	/**
	 * Returns reference to the built-in controllers.
	 */
	static get controllers() {
		return {
			RedirectController: require("./controllers/RedirectController"),
			FileServeController: require("./controllers/FileServeController"),
			DirectoryServeController: require("./controllers/DirectoryServeController"),
			PushServeController: require("./controllers/PushServeController")
		};
	}

	/**
	 * Returns the AwesomeServer instance config.  This is not the same as the
	 * config supplied to each server. Instead this config applies to the greater
	 * AwesomeServer instance which is running the various servers.
	 *
	 * @return {object}
	 */
	get config() {
		return this[$CONFIG];
	}

	/**
	 * Returns the array of servers associated with this AwesomeServer instance.
	 *
	 * @return {Array<AbstractServer>}
	 */
	get servers() {
		return [].concat([...this[$SERVERS]]);
	}

	/**
	 * Returns the array of routes as strings associated with this AwesomeServer instance.
	 *
	 * @return {Array<string>}
	 */
	get routes() {
		return this[$ROUTES].map((route)=>{
			return route.method.toUpperCase()+": "+route.path.toString();
		});
	}

	/**
	 * Returns true if this AwesomeServer is running (start() has been executed).
	 *
	 * @return {boolean}
	 */
	get running() {
		return this[$RUNNING];
	}

	/**
	 * Starts the AwesomeServer instance, if not already running. This in turn will
	 * start each added server and begin to route incoming requests.
	 *
	 * @return {Promise}
	 */
	async start() {
		if (this.running) return Promise.resolve();

		if (this.config.informative) Log.info("Starting...");

		if (this[$SERVERS].size<1) {
			Log.warn("No servers defined. Nothing to do.");
		}
		else {
			await Promise.all([...this[$SERVERS]].map((server)=>{
				let prom = server.start(this.handler.bind(this));
				if (prom instanceof Promise) return prom;
				return Promise.resolve();
			}));
		}

		this[$RUNNING] = true;

		if (this.config.informative) Log.info("Started.");
	}

	/**
	 * Stops the AwesomeServer instance, if running. This in turn will
	 * stop each added server and stop routing incoming requests.
	 *
	 * @return {Promise}
	 */
	async stop() {
		if (!this.running) return Promise.resolve();

		if (this.config.informative) Log.info("Stopping...");

		await Promise.all([...this[$SERVERS]].map((server)=>{
			let prom = server.stop();
			if (prom instanceof Promise) return prom;
			return Promise.resolve();
		}));

		this[$RUNNING] = false;

		if (this.config.informative) Log.info("Stopped.");
	}

	/**
	 * Adds a new server instance to the AwesomeServer. You may add multiple servers
	 * to  single AwesomeServer and each server will be handled for incoming requests
	 * and routed the same way.
	 *
	 * Primarily this method is for adding custom servers. If you are using the default
	 * HTTP, HTTPS, or HTTP/2 servers, use the addHTTPServer(), addHTTPSServer() or
	 * addHTTP2Server() functions instead.
	 *
	 * @param {AbstractServer} server The server instance to add. Must be an extension
	 * of AbstractServer.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	addServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		this[$SERVERS].add(server);

		return server;
	}

	/**
	 * Adds a new HTTP Server to the AwesomeServer instance. The HTTP Server is
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
	 *   port: 7080,
	 *   informative: {inherits from top level config}
	 * };
	 * ```
	 * For more details about config values, please see [nodejs' http module]()
	 *
	 * **An important note about config**: The default *host* setting for AwesomeServer
	 * is `localhost`. This is different than the default for the underlying
	 * nodejs http module of `0.0.0.0`.
	 *
	 * @param {(AwesomeConfig|Object)} config An AwesomeConfig or plain Object.
	 *
	 * @return {AbstractServer}        the server added.
	 */
	addHTTPServer(config) {
		const HTTPServer = require("./http/HTTPServer"); // this is here on purpose.

		config = AwesomeUtils.Object.extend({
			informative: this.config.informative
		},config);

		let server = new HTTPServer(config);
		this.addServer(server);

		return server;
	}

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
	 *   hostname: "localhost"
	 *   port: 7080,
	 *   key: null,
	 *   cert: null,
	 *   pfx: null,
	 *   informative: {inherits from top level config}
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
	addHTTPSServer(config) {
		const HTTPSServer = require("./https/HTTPSServer"); // this is here on purpose.

		config = AwesomeUtils.Object.extend({
			informative: this.config.informative
		},config);

		let server = new HTTPSServer(config);
		this.addServer(server);

		return server;
	}

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
	 *   port: 7080,
	 *   key: null,
	 *   cert: null,
	 *   pfx: null,
	 *   informative: {inherits from top level config}
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
	addHTTP2Server(config) {
		const HTTP2Server = require("./http2/HTTP2Server"); // this is here on purpose.

		config = AwesomeUtils.Object.extend({
			informative: this.config.informative
		},config);

		let server = new HTTP2Server(config);
		this.addServer(server);

		return server;
	}

	/**
	 * Removes a given server from thise AwesomeServer instance. You obtain the server value
	 * as a return value from `addServer()` or `addHTTPServer()` or `addHTTPSServer()` or
	 * `addHTTP2Server()` or from the `servers` getter.
	 *
	 * If the removed server is currently running, it will automatically be stopped as
	 * part of its removal.
	 *
	 * @param  {AbstractServer} server The server to remove.
	 *
	 * @return {boolean}        true if the server was removed.
	 */
	removeServer(server) {
		if (!server) throw new Error("Missing server.");
		if (!(server instanceof AbstractServer)) throw new Error("Invalid Server.");

		if (this[$SERVERS].has(server)) {
			this[$SERVERS].delete(server);
			if (server.running) server.stop();
			return true;
		}
		return false;
	}

	/**
	 * Add a route for incoming requests. A route is defined as some handler that responds to
	 * an incoming request. Routing is the backbone of AwesomeServer which takes an incoming
	 * request from a server, matches zero or more routes against the request, and then
	 * executes each matching route.
	 *
	 * Routing is decribed in much more detail in our routing documentation:
	 *
	 * route() has four different invocations that have slightly different meanings, depending on
	 * the arguments passed into it.
	 *
	 * 	 route(method,path,handler) - The most basic form of routing, this will execute the given
	 * 	 handler Function if the method and path match for an incoming request. (see method and see
	 * 	 path below.)
	 *
	 *   route(method,path,controller) - This will execute the given controller (see
	 *   controllers below) if the method and path match for an incoming request. (see method and
	 *   see path below).
	 *
	 *   route(path,controller) - A synonym for calling route("*",path,controller).
	 *
	 *   route(method,path,filename) - A synonym for calling route(method,path,controller)
	 *   except the given filename is loaded an instantiated as a controller first. This lets you
	 *   reference external controllers by filename easily.
	 *
	 * method: The method argument is a string that identifies one of the well known HTTP Methods
	 * or a wildcard character "*" to match all methods.  The HTTP Methods supported are GET, POST,
	 * PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE, and PATCH.
	 *
	 * path: The path argument may be either a string, a Regular Expression, or an instance of
	 * AbstractPathMatcher. A path matches the path portion of the url; not including the
	 * search/query or hash portions.
	 *
	 *   string: Five different types of string paths can be defined:
	 *
	 * 		exact: A string that matches exactly the url path from the request. Exact path
	 * 		strings look like this: "/test" and do not contain any wildcard "*" or or "|"
	 * 		characters.
	 *
	 * 		startsWith: A string that matches the beginning portion of the url path from the
	 * 		request.  startsWith strings look like this: "/test*" and must end with a
	 * 		wildcard character "*" and may not contain an or "|" character.
	 *
	 * 		endsWith: A string that matches the ending portion of the url path from the
	 * 		request. endsWith strings look like this: "*test" and must begin with a
	 * 		wildcard character "*" and may not contain an or "|" character.
	 *
	 * 		contains: A string that matches if contained within some portion (including the
	 * 		beginning and ending) of the url path from the request.  contains strings look like
	 * 		this: "*test*" and must both begin with and end with the wildcard "*" character and
	 * 		may not contain an or "|" character.
	 *
	 * 		or: two or more path strings (from the above options) separated by an or "|"
	 * 		character where at least one of the or segments matches the url path from the
	 * 		request.  Or strings look like this: "/test|/test/*".
	 *
	 *   RegExp: a regular expression that matches the url path from the request. RegExp
	 *   paths look like this: /^\/test$/
	 *
	 *   AbstractPathMatcher: You may provide your own implementation of AbstractPathMatcher
	 *   to be used to determine if the url path of the request is a match. AbstractPathMatcher
	 *   would need to be extended and the match(path), subtract(path) and toString() methods
	 *   would need to be implemented.
	 *
	 * handler: A handler function that will be executed when the incoming request method
	 * and path matches.  The handler function has the following signature:
	 *
	 * 		handler(path,request,response)
	 *
	 * 			path: is the modified path of the incoming request. It has been modified, but
	 * 			removing the matching path out of it.  For example, if the incoming path is
	 * 			"/api/xyz" and the route path argument is "/api/*" this path argument would
	 * 			have "xyz" as its value; the "/api/" was removed out.
	 *
	 * 			request: An instance of AbstractRequest which wraps the underlying request
	 * 			object from the server. See AbstractRequest for more details.
	 *
	 * 			response: An instance of AbstractResponse which wraps the underlying response
	 * 			obect from the server. See AbstractResponse for more details.
	 *
	 * controller: An instance of AbstractController that will be executed when the incoming
	 * request method and path matches.  Controllers are a great way to strcuture your API
	 * endpoints around url resources. For more information on controllers go here:
	 *
	 * filename: A filename to a valid controller class JS file.  Using filenames has some
	 * special intricacies to be aware of.
	 *
	 * 		resolving: The filename may be a resolved absolute path, or a relative path. In
	 * 		the case of relative paths, AwesomeServer will try to resolve the filename
	 * 		relative to itself, then relative to the module that called AwesomeServer,
	 * 		and finally relative to process.cwd().  The first resolved filename that
	 * 		exists is used.
	 *
	 * 		directories: If the filename resolves to a directory, AwesomeServer will
	 * 		attempt to use all .JS files in that directory or any sub-directory and
	 * 		route them to paths based ont their name and try structure.  For example,
	 * 		consider the directory tree:
	 *
	 * 			./files
	 * 				One.js
	 * 				Two.js
	 * 				Three.js
	 * 				Three
	 * 					One.js
	 *
	 * 		IF the call `route("*","/api","./files")` is made, this would end up routing
	 * 		the following:
	 *
	 * 			`route("*","/api/One","./files/One.js")`
	 * 			`route("*","/api/Two","./files/Two.js")`
	 * 			`route("*","/api/Three","./files/Three.js")`
	 * 			`route("*","/api/Three/One","./files/Three/One.js")`
	 *
	 * 		requirements: For a filename to be routed it must...
	 *
	 *          - exist.
	 *          - be a file or directory, no FIFO or pipes.
	 * 			- Be a valid .js or .node file.
	 * 			- Not contain any syntax errors.
	 * 			- export a class that extends AbstractController or exports an instance of a class that extends AbstractController.
	 *
	 * 		When using filename routing, you may provide additional arguments to the `route()`
	 * 		function and these will be passed to the controller constructor. This allows you
	 * 		to ensure critical data for the controller be passed upward as needed.
	 *
	 * Routes may be added whether or not AwesomeServer has been started.
	 *
	 * @param  {string} method 								 see above.
	 * @param  {(string|RegExp|AbstractPathMatcher)} path    see above.
	 * @param  {(Function|AbstractController)} handler 		 see above.
	 */
	route(method,path,handler,...additionalArgs) {
		// we are just wrapping the internal function here so we dont expose what the internal functions returns.
		_route.call(this,method,path,handler,null,additionalArgs);
	}

	/**
	 * Removes a route. In order to remove a route you must pass the exact same parameters you used
	 * to create the route.
	 *
	 * Routes may be removed whether or not AwesomeServer has been started.
	 *
	 * @param  {string} method 								 see above.
	 * @param  {(string|RegExp|AbstractPathMatcher)} path    see above.
	 * @param  {(Function|AbstractController)} handler 		 see above.
	 *
	 * @return {boolean}  returns true if something was removed, false otherwise.
	 */
	unroute(method,path,handler) {
		// we are just wrapping the internal function here so we dont expose what the internal functions returns.
		return _unroute.call(this,method,path,handler);
	}

	/**
	 * Utility for removing all routes.
	 */
	removeAllRoutes() {
		this[$ROUTES] = [];
	}

	/**
	 * A shortcut method for routing HTTP redirects.
	 *
	 * @param  {string}  method                             The method to match.
	 * @param  {(string|RegExp|AbstractPathMatcher)}  path  The path to match.
	 * @param  {string}  toPath            					The redirect target.
	 * @param  {Boolean} [temporary=false] 					True if you want this to be a temporary redirect as defined in the HTTP Status Codes.
	 */
	redirect(method,path,toPath,temporary=false) {
		if (!method) throw new Error("Missing method.");
		if (typeof method!=="string") throw new Error("Invalid method.");
		if (!path) throw new Error("Missing path.");
		if (!toPath) throw new Error("Missing toPath.");
		if (typeof toPath!=="string") throw new Error("Invalid toPath.");

		this.route(method,path,new RedirectController(toPath,temporary));
		Log.info("Redirect created for "+method.toUpperCase()+" "+path+" to "+toPath);
	}

	/**
	 * A shortcut method for routing a specific file or set of files as a response. All
	 * serve routes are GET only.
	 *
	 * This method has two possilbe usages:
	 *
	 * 		serve(path,contentType,filename);
	 * 		serve(path,filename);
	 *
	 * path: Standard path argument from `route()`.
	 *
	 * contentType: The content-type to send when responding with the given file. if
	 * contentType is null, AwesomeServer will attempt to guess the contentType based
	 * on the filename. If it cannot guess, it will fallback to application-octet-stream.
	 * contentType is ignored if filename is a directory, see below.
	 *
	 * filename: A filename. Using filenames has some special intricacies to be aware of.
	 *
	 * 		resolving: The filename may be a resolved absolute path, or a relative path. In
	 * 		the case of relative paths, AwesomeServer will try to resolve the filename
	 * 		relative to itself, then relative to the module that called AwesomeServer,
	 * 		and finally relative to process.cwd().  The first resolved filename that
	 * 		exists is used.
	 *
	 * 		directories: If the filename resolves to a directory, AwesomeServer will
	 * 		route all the files in that directory and sub-directory based on name.
	 * 		For example, consider the directory tree:
	 *
	 * 			./files
	 * 				index.html
	 * 				hello.css
	 * 				resources
	 * 					image.gif
	 *
	 * 		IF the call `serve("*","/hello","./files")` is made, this would end up routing
	 * 		the following:
	 *
	 * 			`serve("/hello/index.html","./files/index.html")`
	 * 			`serve("/hello/hello.css","./files/hello.css")`
	 * 			`serve("/hello/resources/image.gif","./files/resources/image.gif")`
	 *
	 * 		The directory version of serve will also attempt to match the root name
	 * 		("/hello" in our example) to the root name plus "index.html"
	 * 		(/hello/index.html in our example).
	 *
	 * 		requirements: For a filename to be routed it must...
	 *
	 *          - exist.
	 *
	 * Please note that AwesomeServer will only serve files that exist when the serve function
	 * is called.  Adding files after the fact is not supported.
	 *
	 * @param  {(string|RegExp|AbstractPathMatcher)}  path        The path to match.
	 * @param  {(string|null)}                        contentType Optional contentType to use when serving.
	 * @param  {string}                               filename    Filename or directory to serve.
	 */
	serve(path,contentType,filename) {
		if (arguments.length===2) [path,contentType,filename] = [path,null,contentType];

		if (!path) throw new Error("Missing path.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		let resolved = _resolve(filename);
		if (!resolved) throw new Error("Filename or directory not found: "+filename);

		let file = resolved.filename;
		let stat = resolved.stat;

		if (stat.isDirectory()) {
			let controller = new DirectoryServeController(file);
			let parent = _route.call(this,"*",path,controller);

			let wc = (path+"/").replace(/\/\/+/g,"/").replace(/\/\//,"/");
			wc = wc.replace(/\/\*\//,"/");
			if (wc!==path) {
				_route.call(this,"*",wc,controller,parent);
				Log.info("DirectoryServe created for "+wc+" from "+file);
			}

			let wce = ((path+"/").replace(/\/\/+/g,"/").replace(/\/\//,"/")+"*").replace(/\/\*\//,"/");
			if (wce!==path && wce!==wc) {
				_route.call(this,"*",wce,controller,parent);
				Log.info("DirectoryServe created for "+wce+" from "+file);
			}
		}
		else if (stat.isFile()) {
			this.route("*",path,new FileServeController(contentType,file));
			Log.info("FileServe created for "+path+" from "+file);
		}
		else {
			throw new Error("Invalid filename, is neither directory or file: "+filename);
		}
	}

	/**
 	 * A shortcut method for routing a specific file as a push portion of an http/2 request.
 	 *
 	 * HTTP/2 allows for multiple response to be sent for a single incoming request. This
 	 * route approach lets you indicate certain files that should be pushed as part
 	 * of a HTTP/2 response; instead of having to create a custom route every time.
	 *
	 * @param  {(string|RegExp|AbstractPathMatcher)}  path           The path to match.
	 * @param  {string}                               referencePath  the path the push is served as, used by http/2 in its resolve.
	 * @param  {(string|null)}                        contentType    Optional contentType to use when serving.
	 * @param  {string}                               filename       Filename or directory to serve.
	 */
	push(path,referencePath,contentType,filename) {
		if (arguments.length===3) [path,referencePath,contentType,filename] = [path,referencePath,null,contentType];

		if (!path) throw new Error("Missing path.");
		if (!referencePath) throw new Error("Missing referencePath.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		let resolved = _resolve(filename);
		if (!resolved) throw new Error("Filename not found: "+filename);

		let file = resolved.filename;
		let stat = resolved.stat;

		if (stat.isFile()) {
			this.route("*",path,new PushServeController(referencePath,contentType,file));
			Log.info("Push created for "+path+" from "+referencePath+"/"+file);
		}
		else {
			throw new Error("Invalid filename, is not a file: "+filename);
		}
	}

	/**
	 * Given some file path, attempt to locate an existing version of that file path
	 * based on the following rules:
	 *
	 * 		- absolute path;
	 * 		- relative to AwesomeServer;
	 * 		- relative to the module which created AwesomeServer;
	 * 		- relative to process.cwd().
	 *
	 * The first of these that exists in the order outlined above, wins.  Of none
	 * of these exists, returns null.
	 *
	 * This function is useful for resolving against you developed code. It is also
	 * used by the AwesomeServe wherever a filename is used.
	 *
	 * @param  {string} filename   filename to find
	 * @return {(string|null)}      fully resolved filename
	 */
	resolve(filename) {
		let resolved = _resolve(filename);
		return resolved && resolved.filename || null;
	}

	/**
	 * AwesomeServer's primary handler for incoming request.  Each server is given
	 * this method to process incoming request against.
	 *
	 * It is exposed here to be overloaded as needed.
	 *
	 *,args @param  {AbstractRequest}   request  The incoming request request object.
	 * @param  {AbstractResponse}  response THe incoming request response object.
	 * @return {Promise} A promise that resolves when the request handling is complete.
	 */
	async handler(request,response) {
		if (!request) throw new Error("Missing request.");
		if (!(request instanceof AbstractRequest)) throw new Error("Invalid request.");
		if (!response) throw new Error("Missing response.");
		if (!(response instanceof AbstractResponse)) throw new Error("Invalid response.");

		let url = request.method+" "+request.url.href; //(request.url && request.url.href || request.url && request.url.toString() || request.url.toString());
		let path = decodeURIComponent(request.path || "/");

		// Log.access("Request "+url+" from "+request.origin+".");

		let routes = this[$ROUTES].reduce((routes,route)=>{
			if (route) {
				if (route.method==="*" || route.method===request.method) {
					if (route.routes && route.routes.length>0) {
						let matchResult = route.matcher.match(path);
						if (matchResult) {
							let mypath = route.matcher.subtract(path);
							route.routes.forEach((r)=>{
								routes.push({
									fullpath: path,
									path: mypath,
									result: matchResult,
									router: r
								});
							});

						}
					}
				}
			}
			return routes;
		},[]);

		try {
			await new Promise((resolve,reject)=>{
				const nextRoute = async function nextRoute() {
					try {
						if (response.finished) return resolve();

						let route = routes.shift();
						if (!route) return resolve();

						let pathOrParams = route.path;
						if (route.result && route.result!==true) pathOrParams = route.result;
						let p = route.router.call(this,pathOrParams,request,response);
						if (p instanceof Promise) await p;

						setImmediate(nextRoute);
					}
					catch (ex) {
						Log.error("Error in routing for "+url+".",ex);
						return reject(ex);
					}
				};

				nextRoute();
			});

			if (!response.finished) {
				Log.error("404 Not found "+url+".");
				await response.writeError(404,"404 Not found "+url+".");
			}
		}
		catch (ex) {
			Log.error("Error handling request "+url+".",ex);
			response.writeError(500,"Error handling request "+url+".");
		}
	}
}

/**
 * Internal route function.
 * @private
 */
const _route = function _route(method,path,handler,parent=null,additionalArgs=[]) {
	if (typeof method==="string" && path instanceof AbstractController) [method,path,handler,parent] = ["*",...arguments];
	if (typeof method==="string" && Object.prototype.isPrototypeOf.call(AbstractController,path)) [method,path,handler,parent] = ["*",...arguments];

	if (!method) throw new Error("Missing method.");
	if (typeof method!=="string") throw new Error("Invalid method.");
	if (!path) throw new Error("Missing path.");
	if (typeof path!=="string" && !(path instanceof RegExp)) throw new Error("Invalid path.");
	if (!handler) throw new Error("Missing handler.");

	method = method.toUpperCase();
	let route = {
		method,
		path,
		handler,
		routes: null,
		matcher: AbstractPathMatcher.getMatcher(path)
	};

	if (handler instanceof AbstractController) {
		_routeController.call(this,route,handler);
	}
	else if (Object.prototype.isPrototypeOf.call(AbstractController,handler)) {
		_routeController.call(this,route,Reflect.construct(handler,additionalArgs));
	}
	else if (handler instanceof Function) {
		_routeFunction.call(this,route,handler);
	}
	else if (typeof handler==="string") {
		let resolved = _resolve(handler);
		if (resolved===null) throw new Error("Invalid handler, file or directory not found: "+handler);

		let filename = resolved.filename;
		let stat = resolved.stat;

		if (stat.isDirectory()) {
			_routeDirectory.call(this,route,filename,path,additionalArgs);
		}
		else if (stat.isFile()) {
			_routeFile.call(this,route,filename,additionalArgs);
		}
		else {
			throw new Error("Invalid handler, is neither directory or file: "+filename);
		}
	}
	if (!route.routes) throw new Error("Invalid handler.");

	this.unroute(method,path,handler);
	this[$ROUTES].push(route);
	if (parent) {
		parent.children = parent.children || [];
		parent.children.push(route);
	}

	if (this.config.informative) Log.info("Added route "+method+" "+route.matcher.toString());

	return route;
};

/**
 * Internal route function specifically for function cases.
 * @private
 */
const _routeFunction = function _routeContoller(route,handler) {
	route.routes = [function router(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				if (response.finished) return resolve();

				let prom = handler(path,request,response);
				if (prom instanceof Promise) await prom;
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}];

	return route;
};

/**
 * Internal route function specifically for controller cases.
 * @private
 */
const _routeController = function _routeController(route,controller) {
	_routeFunction.call(this,route,controller.handler.bind(controller));
	return route;
};

/**
 * Internal route function specifically for file cases.
 * @private
 */
const _routeFile = function routeControllerFile(route,filename,additionalArgs=[]) {
	let clazz;
	try {
		clazz = AwesomeUtils.Module.require(filename);
	}
	catch (ex) {
		Log.error("Error loading controller "+filename,ex);
		throw ex;
	}

	if (!clazz) {
		Log.error("Loaded controller not found "+filename);
		throw new Error("Loaded controller not found "+filename);
	}
	else if (clazz instanceof Function && Object.prototype.isPrototypeOf.call(AbstractController,clazz)) {
		let instance;
		try {
			instance = Reflect.construct(clazz,additionalArgs);
		}
		catch (ex) {
			Log.error("Error instantiating controller.",ex);
			throw ex;
		}
		if (!(instance instanceof AbstractController)) {
			Log.error("Loaded controller does not extend AbstractController "+filename);
			throw new Error("Loaded controller does not extend AbstractController "+filename);
		}

		if (this.config.informative) Log.info("Loaded controller from "+filename+".");
		_routeController.call(this,route,instance);
	}
	else if (clazz instanceof AbstractController) {
		if (this.config.informative) Log.info("Loaded controller from "+filename+".");
		_routeController.call(this,route,clazz);
	}
	else {
		Log.error("Loaded controller does not extend AbstractController "+filename);
		throw new Error("Loaded controller does not extend AbstractController "+filename);
	}

	return route;
};

/**
 * Internal route function specifically for directory cases.
 * @private
 */
const _routeDirectory = function _routeDirectory(parent,dir,path="/",additionalArgs=[]) {
	parent.routes = [];

	FS.readdirSync(dir).forEach((filename)=>{
		filename = Path.resolve(dir,filename);
		let filepath = ((path && path!=="/" && path!=="." && path!==".." ? path+"/" : "/")+Path.basename(filename,Path.extname(filename))).replace(/\/\/+/g,"/");
		let ext = Path.extname(filename);
		let stats = null;
		try {
			stats = FS.statSync(filename);
		}
		catch (ex) {
			stats = null;
		}
		if (!stats) return;

		if (stats.isDirectory()) return _routeDirectory.call(this,parent,filename,filepath,additionalArgs);

		if (ext===".js" || ext===".node" || ext===".ts") {
			_route.call(this,"*",filepath,filename,parent,additionalArgs);
			try {
				stats = FS.statSync(filename);
			}
			catch (ex) {
				stats = null;
			}

			if (stats && !stats.isDirectory()) _route.call(this,"*",filepath+"/*",filename,parent,additionalArgs);
		}
	});
};

/**
 * Internal unroute function.
 * @private
 */
const _unroute = function _unroute(method,path,handler) {
	if (typeof method==="string" && path instanceof AbstractController) [method,path,handler] = ["*",...arguments];
	if (typeof method==="string" && Object.prototype.isPrototypeOf.call(AbstractController,path)) [method,path,handler] = ["*",...arguments];

	if (!method) throw new Error("Missing method.");
	if (typeof method!=="string") throw new Error("Invalid method.");
	if (!path) throw new Error("Missing path.");
	if (typeof path!=="string" && !(path instanceof RegExp)) throw new Error("Invalid path.");

	method = method.toUpperCase();

	// find matching routes
	let matching = this[$ROUTES].filter((route)=>{
		return route.method===method &&
			(
				(route.path instanceof RegExp && path instanceof RegExp && route.path.toString()===path.toString()) ||
				(typeof route.path==="string" && typeof path==="string" && route.path===path)
			)
		&& (!handler || route.handler===handler);
	});

	// remove them
	this[$ROUTES] = this[$ROUTES].filter((route)=>{
		return matching.indexOf(route)<0;
	});

	// cleanup child routes if any
	matching.forEach((route)=>{
		(route.children||[]).forEach((child)=>{
			_unroute.call(this,child.method,child.path,child.handler);
		});
	});

	if (matching.length>0 && this.config.informative) Log.info("Removed route "+method+" "+path.toString());

	return matching.length>0;
};

/**
 * Internal _resolve function.
 * @private
 */
const _resolve = function resolve(filename) {
	const getStat = (f)=>{
		try {
			return FS.statSync(f);
		}
		catch (ex) {
			return null;
		}
	};

	let path,stat;

	// try the filename itself
	path = filename;
	stat = getStat(path);
	if (stat) return {
		filename: path,
		stat
	};

	// try the filename relative to the module
	if (module && module.parent) {
		path = AwesomeUtils.Module.resolve(module.parent,filename);
		stat = getStat(path);
		if (stat) return {
			filename: path,
			stat
		};
	}

	// try the filename relative to process.cwd()
	path = Path.resolve(process.cwd(),filename);
	stat = getStat(path);
	if (stat) return {
		filename: path,
		stat
	};

	// fail
	return null;
};

module.exports = AwesomeServer;

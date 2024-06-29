export = AwesomeServer;
/**
 * AwesomeServer is a customizable API Server framework for enterprise nodejs
 * applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
 * provide flexible routing and controllers for responding to incoming requests in a
 * consistent, repeatable fashion.
 *
 * Please see the documentation at @link https://github.com/awesomeeng/AwesomeServer.
 */
declare class AwesomeServer {
    /**
     * Returns a reference to the AbstractServer class for custom extensions.
     *
     * @return Class
     */
    static get AbstractServer(): typeof AbstractServer;
    /**
     * Returns a reference to the AbstractRequest class for custom extensions.
     *
     * @return Class
     */
    static get AbstractRequest(): typeof AbstractRequest;
    /**
     * Returns a reference to the AbstractResponse class for custom extensions.
     *
     * @return Class
     */
    static get AbstractResponse(): typeof AbstractResponse;
    /**
     * Returns a reference to the AbstractController class for custom extensions.
     *
     * @return Class
     */
    static get AbstractController(): typeof AbstractController;
    /**
     * Returns a reference to the AbstractPathMatcher class for custom extensions.
     */
    static get AbstractPathMatcher(): typeof AbstractPathMatcher;
    /**
     * Returns references to HTTPServer, HTTPRequest, and HTTPResponse for custom extensions.
     */
    static get http(): {
        HTTPServer: typeof import("./http/HTTPServer");
        HTTPRequest: typeof import("./http/HTTPRequest");
        HTTPResponse: typeof import("./http/HTTPResponse");
    };
    /**
     * Returns references to HTTPSServer, HTTPSRequest, and HTTPSResponse for custom extensions.
     */
    static get https(): {
        HTTPSServer: typeof import("./https/HTTPSServer");
        HTTPSRequest: typeof import("./https/HTTPSRequest");
        HTTPSResponse: typeof import("./https/HTTPSResponse");
    };
    /**
     * Returns references to HTTP2Server, HTTP2Request, and HTTP2Response for custom extensions.
     */
    static get http2(): {
        HTTP2Server: typeof import("./http2/HTTP2Server");
        HTTP2Request: typeof import("./http2/HTTP2Request");
        HTTP2Response: typeof import("./http2/HTTP2Response");
    };
    /**
     * Returns reference to the built-in controllers.
     */
    static get controllers(): {
        RedirectController: typeof RedirectController;
        FileServeController: typeof FileServeController;
        DirectoryServeController: typeof DirectoryServeController;
        PushServeController: typeof PushServeController;
    };
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
    constructor(config?: {});
    /**
     * Returns the AwesomeServer instance config.  This is not the same as the
     * config supplied to each server. Instead this config applies to the greater
     * AwesomeServer instance which is running the various servers.
     *
     * @return {object}
     */
    get config(): any;
    /**
     * Returns the array of servers associated with this AwesomeServer instance.
     *
     * @return {Array<AbstractServer>}
     */
    get servers(): AbstractServer[];
    /**
     * Returns the array of routes as strings associated with this AwesomeServer instance.
     *
     * @return {Array<string>}
     */
    get routes(): string[];
    /**
     * Returns true if this AwesomeServer is running (start() has been executed).
     *
     * @return {boolean}
     */
    get running(): boolean;
    /**
     * Starts the AwesomeServer instance, if not already running. This in turn will
     * start each added server and begin to route incoming requests.
     *
     * @return {Promise}
     */
    start(): Promise<any>;
    /**
     * Stops the AwesomeServer instance, if running. This in turn will
     * stop each added server and stop routing incoming requests.
     *
     * @return {Promise}
     */
    stop(): Promise<any>;
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
    addServer(server: AbstractServer): AbstractServer;
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
    addHTTPServer(config: (AwesomeConfig | any)): AbstractServer;
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
    addHTTPSServer(config: (AwesomeConfig | any)): AbstractServer;
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
    addHTTP2Server(config: (AwesomeConfig | any)): AbstractServer;
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
    removeServer(server: AbstractServer): boolean;
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
    route(method: string, path: (string | RegExp | AbstractPathMatcher), handler: (Function | AbstractController), ...additionalArgs: any[]): void;
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
    unroute(method: string, path: (string | RegExp | AbstractPathMatcher), handler: (Function | AbstractController)): boolean;
    /**
     * Utility for removing all routes.
     */
    removeAllRoutes(): void;
    /**
     * A shortcut method for routing HTTP redirects.
     *
     * @param  {string}  method                             The method to match.
     * @param  {(string|RegExp|AbstractPathMatcher)}  path  The path to match.
     * @param  {string}  toPath            					The redirect target.
     * @param  {Boolean} [temporary=false] 					True if you want this to be a temporary redirect as defined in the HTTP Status Codes.
     */
    redirect(method: string, path: (string | RegExp | AbstractPathMatcher), toPath: string, temporary?: boolean): void;
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
    serve(path: (string | RegExp | AbstractPathMatcher), contentType: (string | null), filename: string, ...args: any[]): void;
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
    push(path: (string | RegExp | AbstractPathMatcher), referencePath: string, contentType: (string | null), filename: string, ...args: any[]): void;
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
    resolve(filename: string): (string | null);
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
    handler(request: AbstractRequest, response: AbstractResponse): Promise<any>;
}
import AbstractServer = require("./AbstractServer");
import AbstractPathMatcher = require("./AbstractPathMatcher");
import AbstractController = require("./AbstractController");
import AbstractRequest = require("./AbstractRequest");
import AbstractResponse = require("./AbstractResponse");
import RedirectController = require("./controllers/RedirectController");
import FileServeController = require("./controllers/FileServeController");
import DirectoryServeController = require("./controllers/DirectoryServeController");
import PushServeController = require("./controllers/PushServeController");

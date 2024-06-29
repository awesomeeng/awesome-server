export = HTTPServer;
/**
 * HTTP implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTPServer() is used. This is basically a
 * wrapper around nodejs' http module.
 *
 * @extends AbstractServer
 */
declare class HTTPServer extends AbstractServer {
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
    start(handler: Function): Promise<any>;
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
    handleRequest(handler: Function, request: any, response: any): void;
}
import AbstractServer = require("../AbstractServer");

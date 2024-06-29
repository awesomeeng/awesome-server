export = HTTP2Server;
/**
 * HTTP/2 implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTP2Server() is used. This is basically a
 * wrapper around nodejs' http2 module.
 *
 * @extends AbstractServer
 */
declare class HTTP2Server {
    /**
     * Static utility function for loading a certificate from a file system
     * or treating the passed string as the certificate.
     *
     * @param  {string|buffer} value
     * @param  {string} [type="certificate"]
     * @return {string}
     */
    static resolveCertConfig(value: string | buffer, type?: string, informative?: boolean): string;
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
    constructor(config: (AwesomeConfig | any));
    /**
     * Returns true if this server is started.
     *
     * @return {boolean}
     */
    get running(): boolean;
    /**
     * Returns the underlying, wrapped, nodejs http2 server.
     *
     * @return {*}
     */
    get original(): any;
    /**
     * Returns the bound hostname for this server.
     *
     * @return {string}
     */
    get hostname(): string;
    /**
     * Returns the bound port for this server.
     *
     * @return {number}
     */
    get port(): number;
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
    start(handler: Function): Promise<any>;
    /**
     * Stops the server running.
     *
     * Returns a Promise that will resolve when the underlying server
     * has stopped.
     *
     * @return {Promise}
     */
    stop(): Promise<any>;
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
    handleRequest(handler: Function, request: any, response: any): void;
}

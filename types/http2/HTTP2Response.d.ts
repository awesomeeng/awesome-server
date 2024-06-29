export = HTTP2Response;
/**
 * HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
 * turn extends for HTTPRequest and AbstractRequest.  A lot of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */
declare class HTTP2Response {
    /**
     * @constructor
     * @param {IncomingMessage} request
     * @param {ServerResponse} response
     */
    constructor(request: IncomingMessage, response: ServerResponse);
    /**
     * Returns the underlying HTTP/2 stream for this response.
     *
     * @return {Http2Stream}
     */
    get stream(): Http2Stream;
    /**
     * Returns the relative server root for this incoming request. This allows
     * the response to send back relative responses.
     *
     * @return {string}
     */
    get serverRoot(): string;
    /**
     * Resolve a given path against the incoming request server root.
     *
     * @param  {string} path
     *
     * @return {string}
     */
    resolve(path: string): string;
    /**
     * Returns true if http/2 push is supported.
     *
     * @return {boolean}
     */
    get pushSupported(): boolean;
    /**
     * Creates a new push stream as part of this response and pushes some
     * content to it. The path for the push should be resolved using the
     * resolve() function if it is relative.
     *
     * Returns a Promise that will resolve when the push is complete.
     *
     * @param  {number} statusCode
     * @param  {string} path
     * @param  {string} contentType
     * @param  {(Buffer|string)} content
     * @param  {Object} [headers={}]
     *
     * @return {Promise}
     */
    push(statusCode: number, path: string, contentType: string, content: (Buffer | string), headers?: any, ...args: any[]): Promise<any>;
    /**
     * A push shortcut for text/plain content.
     *
     * Returns a Promise that will resolve when the push is complete.
     *
     * @param  {number} statusCode
     * @param  {string} path
     * @param  {*}      content
     * @param  {Object} headers
     *
     * @return {Promise}
     */
    pushText(statusCode: number, path: string, content: any, headers: any): Promise<any>;
    /**
     * A push shortcut for text/css content.
     *
     * Returns a Promise that will resolve when the push is complete.
     *
     * @param  {number} statusCode
     * @param  {string} path
     * @param  {*}      content
     * @param  {Object} headers
     *
     * @return {Promise}
     */
    pushCSS(statusCode: number, path: string, content: any, headers: any): Promise<any>;
    /**
     * A push shortcut for text/html content.
     *
     * Returns a Promise that will resolve when the push is complete.
     *
     * @param  {number} statusCode
     * @param  {string} path
     * @param  {*}      content
     * @param  {Object} headers
     *
     * @return {Promise}
     */
    pushHTML(statusCode: number, path: string, content: any, headers: any): Promise<any>;
    /**
     * A push shortcut for application/json content.
     *
     * If content is a string, it is assumed to be JSON already. If it is not
     * a string, it is converted to json by way of JSON.stringify().
     *
     * Returns a Promise that will resolve when the push is complete.
     *
     * @param  {number} statusCode
     * @param  {string} path
     * @param  {*}      content
     * @param  {Object} headers
     *
     * @return {Promise}
     */
    pushJSON(statusCode: number, path: string, content: any, headers: any): Promise<any>;
    /**
     * Creates a new push stream as part of this response and pushes the
     * content from the given filename to it. The path for the push should be
     * resolved using the resolve() function if it is relative.
     *
     * The filename should be resolved using AwesomeServer.resolve() prior
     * to calling this function.
     *
     * Returns a Promise that will resolve when the push is complete.
     *
     * @param  {number} statusCode  [description]
     * @param  {string} path        [description]
     * @param  {string} contentType [description]
     * @param  {string} filename    [description]
     * @param  {Object} headers     [description]
     *
     * @return {Promise}             [description]
     */
    pushServe(statusCode: number, path: string, contentType: string, filename: string, headers: any, ...args: any[]): Promise<any>;
}

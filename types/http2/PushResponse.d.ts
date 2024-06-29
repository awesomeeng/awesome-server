export = PushResponse;
/**
 * Class for wrapping HTTP/2 push response streams.
 *
 * Given some HTTP2 response, it is possible to push additional assets as part of
 * the outgoing stream. To do so, we create a PushResponse for each additional
 * asset.
 *
 * A PushResponse is created by calling PushResponse.create() instead of
 * by using its constructor.
 *
 * Once created the PushResponse can be used to write or stream data as need. Calling
 * end() of a PushResponse closes just that PushResponse, and not the parent HTTP/2
 * response.
 */
declare class PushResponse {
    /**
     * Factory function. Use this instead of the constructor.
     *
     * @param  {HTTP2Response} parent
     * @param  {Object|null} headers
     * @return {Promise}
     */
    static create(parent: HTTP2Response, headers: any | null): Promise<any>;
    /**
     * Constructor, but should not be used. use PushResponse.create() instead.
     *
     * @constructor
     * @param {HTTP2Response} parent
     * @param {*} stream
     * @param {Object} [headers={}]
     */
    constructor(parent: HTTP2Response, stream: any, headers?: any);
    /**
     * Returns the parent HTTP2 or PushResponse object.
     *
     * @return {(HTTP2Response|PushResponse)}
     */
    get parent(): any;
    /**
     * Returns the underlying HTTP/2 stream.
     *
     * @return {*}
     */
    get stream(): any;
    /**
     * Returns the headers object set by writeHead().
     * @return {Object}
     */
    get headers(): any;
    /**
     * Returns true if this stream has been closed, regardless of how it was closed.
     * @return {boolean}
     */
    get closed(): boolean;
    /**
     * Sets the status code and headers for the push response. This may only be
     * called once per push response and cannot be called after a write() or
     * and end() for this push response has been called.
     *
     * Unlike write() and end() this does not return a Promise and does
     * not need to be preceeded by an await.
     *
     * THe headers parameter should have the header keys as lower case.
     *
     * @param statusCode {number}
     * @param statusMessage {(string|null)} optional.
     * @param headers {Object} optional.
     */
    writeHead(statusCode: number, statusMessage: (string | null), headers: any, ...args: any[]): any;
    /**
     * Writes a chunk of data to the push response with the given encoding.
     *
     * Returns a Promise that will resolve when the write is complete.
     * It is always good practice to await a write().
     *
     * @param data {(Buffer|string)}
     * @param encoding {string} optional. Defaults to utf-8.
     *
     * @return {Promise}
     */
    write(data: (Buffer | string), encoding: string): Promise<any>;
    /**
     * Writes the passed in data to the push response with the given encoding
     * and then marks the push response finished.
     *
     * Returns a Promise that will resolve when the end is complete.
     * It is always good practice to await an end().
     *
     * @param data {(Buffer|string)}
     * @param encoding {string} optional. Defaults to utf-8.
     *
     * @return {Promise}
     */
    end(data: (Buffer | string), encoding: string): Promise<any>;
    /**
     * Pipes the given Readable stream into the push response object. writeHead()
     * should be called prior to this.
     *
     * When the pipeFrom() is complete, end() is called and the push response
     * is marked finished.
     *
     * It is worth noting that pipeFrom() is different from nodejs Stream
     * pipe() method in that pipe() takes as an argument the writable stream.
     * pipeFrom() flips that and takes as an argument the readable stream.
     *
     * Returns a Promise that will resolve when the end of the stream has
     * been sent and end() has been called. It is always good practice to
     * await pipeFrom().
     *
     * @return {Promise}
     */
    pipeFrom(readable: any): Promise<any>;
}

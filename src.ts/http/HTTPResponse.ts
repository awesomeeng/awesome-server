// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { ServerResponse } from "http";
import { Readable } from "stream";
import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { AbstractResponse } from "../AbstractResponse";

/**
 * A wrapper for the nodejs http ServerResponse object that is received
 * when an incoming request comes into the server.
 *
 * @extends AbstractResponse
 */
export class HTTPResponse extends AbstractResponse {
    /**
     * Constructor which takes the nodejs http ServerResponse and wraps
     * it in a custom AbstractResponse object.
     *
     * @param {ServerResponse} response
     */
    constructor(response: ServerResponse) {
        super(response);
    }

    /**
     * Returns true when the response is finished (end() has been called)
     * and cannot receive any more data/changes.
     *
     * @return {boolean}
     */
    get finished(): boolean {
        return (this.original as ServerResponse).finished || false;
    }

    /**
     * Returns the status code set with writeHead for this response.
     *
     * @return {number}
     */
    get statusCode(): number {
        return (this.original as ServerResponse).statusCode;
    }

    /**
     * Returns true if HTTP/2 server push is supported.
     *
     * @return {boolean}
     */
    get pushSupported(): boolean {
        return false;
    }

    /**
     * Returns the headers set with writeHead for this response.
     * @return {Record<string, string>}
     */
    get headers(): Record<string, string> {
        return (this.original as ServerResponse).getHeaders() as Record<string, string>;
    }

    /**
     * Returns the mime-type portion from the Content-Type header.
     *
     * @return {string}
     */
    get contentType(): string {
        const headers = this.headers;
        return AwesomeUtils.Request.parseContentType(headers && headers["Content-Type"] || "");
    }

    /**
     * Returns the charset (encoding) portion from the Content-Type
     * header for this response.
     *
     * @return {string}
     */
    get contentEncoding(): string {
        const headers = this.headers;
        return AwesomeUtils.Request.parseContentEncoding(headers && headers["Content-Type"] || "");
    }

    /**
     * Set a header for outgoing requests. Any header set via setHeader()
     * is merged with any headers set by writeHead() before the final response
     * is sent.
     *
     * @param {string} name
     * @param {string} value
     */
    setHeader(name: string, value: string): void {
        (this.original as ServerResponse).setHeader(name, value);
    }

    /**
     * Sets the status code and headers for the response. This may only be
     * called once per request and cannot be called after a write() or
     * and end() has been called.
     *
     * The headers parameter should have the header keys as lower case.
     *
     * @param {number} statusCode
     * @param {Record<string, string>} headers
     */
    writeHead(statusCode: number, headers: Record<string, string>): void {
        (this.original as ServerResponse).writeHead(statusCode, headers);
    }

    /**
     * Write content to the response. Content must be a string or Buffer.
     *
     * @param {string|Buffer} content
     */
    write(content: string | Buffer): void {
        (this.original as ServerResponse).write(content);
    }

    /**
     * End the response, optionally writing some content first. No more
     * writes may occur after end() is called.
     */
    end(): void {
        (this.original as ServerResponse).end();
    }

    /**
     * Pipe the contents of a readable stream to this response.
     *
     * @param {Readable} readable
     * @return {Promise<void>}
     */
    async pipeFrom(readable: Readable): Promise<void> {
        return new Promise((resolve,reject) => {
            try {
                readable.pipe(this.original as ServerResponse);
                readable.on("end",resolve);
                readable.on("error",reject);
            }
            catch (ex) {
                return reject(ex);
            }
        });
    }
}

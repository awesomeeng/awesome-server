// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { IncomingMessage } from "http";
import * as URL from "url";
import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { AbstractRequest } from "../AbstractRequest";

const $CONTENT = Symbol("content");

/**
 * A wrapper for the nodejs http IncomingMessage object that is received
 * when an incoming request comes into the server.
 *
 * @extends AbstractRequest
 */
export class HTTPRequest extends AbstractRequest {
    private [$CONTENT]?: Buffer;

    /**
     * Constructor which takes the nodejs http IncomingMessage and wraps
     * it in a custom AbstractRequest object.
     *
     * @param {IncomingMessage} request
     */
    constructor(request: IncomingMessage) {
        super(request);
    }

    /**
     * Returns the origin details for the incoming request, to the best
     * of its ability to figure out.
     *
     * @return {string}
     */
    get origin(): string {
        const original = this.original as IncomingMessage;
        return (original.socket && original.socket.remoteAddress && original.socket.remotePort && 
                original.socket.remoteAddress + ":" + original.socket.remotePort) || 
               this.headers.get("referer") || 
               this.headers.get("referrer") || 
               this.headers.get("origin") || 
               "";
    }

    /**
     * Returns the method for this request.
     *
     * @return {string}
     */
    get method(): string {
        return (this.original as IncomingMessage).method || "GET";
    }

    /**
     * Returns the URL object for this request.
     *
     * @return {URL.UrlWithParsedQuery}
     */
    get url(): URL.UrlWithParsedQuery {
        return URL.parse((this.original as IncomingMessage).url || "", true);
    }

    /**
     * Returns the path portion of the URL for this request.
     * @return {string}
     */
    get path(): string {
        return this.url.pathname || "/";
    }

    /**
     * Returns the parsed query object from the URL for this request.
     *
     * @return {Record<string, string | string[]>}
     */
    get query(): Record<string, string | string[]> {
        return this.url.query as Record<string, string | string[]>;
    }

    /**
     * Returns the string form of the query/search section of the
     * URL for this request.
     *
     * @return {string}
     */
    get querystring(): string {
        return (this.url.search || "").replace(/^\?/, "");
    }

    /**
     * Returns the headers as a Map for this request.
     *
     * @return {Map<string, string>}
     */
    get headers(): Map<string, string> {
        const original = this.original as IncomingMessage;
        const headers = new Map<string, string>();
        Object.entries(original.headers).forEach(([key, value]) => {
            if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
        });
        return headers;
    }

    /**
     * Returns the mime-type portion of the content-type header for this
     * request.
     *
     * @return {string}
     */
    get contentType(): string {
        const contentType = this.headers.get("content-type") || "";
        return AwesomeUtils.Request.parseContentType(contentType);
    }

    /**
     * Returns the encoding portion of the content-type header for this
     * request.
     *
     * @return {string}
     */
    get contentEncoding(): string {
        const contentType = this.headers.get("content-type") || "";
        return AwesomeUtils.Request.parseContentEncoding(contentType);
    }

    /**
     * Returns the user-agent header for this request.
     *
     * @return {string}
     */
    get useragent(): string {
        return this.headers.get("user-agent") || "";
    }

    /**
     * Returns a Promise that will resolve with the content of this request
     * as a Buffer.
     *
     * @return {Promise<Buffer>}
     */
    async read(): Promise<Buffer> {
        if (this[$CONTENT]) return this[$CONTENT];

        return new Promise((resolve,reject) => {
            try {
                const original = this.original as IncomingMessage;
                const chunks: Buffer[] = [];
                original.on("data",(chunk: Buffer) => {
                    chunks.push(chunk);
                });
                original.on("end",() => {
                    this[$CONTENT] = Buffer.concat(chunks);
                    resolve(this[$CONTENT]!);
                });
                original.on("error",(err) => {
                    reject(err);
                });
            }
            catch (ex) {
                return reject(ex);
            }
        });
    }
}

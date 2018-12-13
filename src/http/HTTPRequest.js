// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const URL = require("url");

const AwesomeUtils =  require("@awesomeeng/awesome-utils");

const AbstractRequest = require("../AbstractRequest");

const $CONTENT = Symbol("content");

/**
 * A wrapper for the nodejs http IncomingMessage object that is received
 * when an incoming request comes into the server.
 *
 * @extends AbstractRequest
 */
class HTTPRequest extends AbstractRequest{
	/**
	 * Constructor which takes the nodejs http IncomingMessage and wraps
	 * it in a custom AbstractRequest object.
	 *
	 * @param {IncomingMessage} request
	 */
	constructor(request) {
		super(request);
	}

	/**
	 * Returns the origin details for the incoming request, to the best
	 * of its ability to figure out.
	 *
	 * @return {string}
	 */
	get origin() {
		return this.original.socket && this.original.socket.remoteAddress && this.original.socket.remotePort && this.original.socket.remoteAddress+":"+this.original.socket.remotePort || this.headers.referer || this.headers.referrer || this.headers.origin || "";
	}

	/**
	 * Returns the method for this request.
	 *
	 * @return {string}
	 */
	get method() {
		return this.original.method;
	}

	/**
	 * Returns the URL object for this request.
	 *
	 * @return {URL}
	 */
	get url() {
		return URL.parse(this.original.url,true);
	}

	/**
	 * Returns the path portion of the URL for this request.
	 * @return {string}
	 */
	get path() {
		return this.original.url;
	}

	/**
	 * Returns the parsed query object from the URL for this request.
	 *
	 * @return {Object}
	 */
	get query() {
		return this.url.query;
	}

	/**
	 * Returns the string form of the query/search section of the
	 * URL for this request.
	 *
	 * @return {string}
	 */
	get querystring() {
		return this.url.search.replace(/^\?/,"");
	}

	/**
	 * Returns the headers as an object for this request.
	 *
	 * @return {Object}
	 */
	get headers() {
		return this.original.headers;
	}

	/**
	 * Returns the mime-type portion of the content-type header for this
	 * request.
	 *
	 * @return {string}
	 */
	get contentType() {
		return AwesomeUtils.Request.parseContentType(this.headers && this.headers["content-type"] || "");
	}

	/**
	 * Returns the charset (encoding) portion of the content-type header
	 * for this request. If no encoding is provided, returns "utf-8".
	 *
	 * @return {string}
	 */
	get contentEncoding() {
		return AwesomeUtils.Request.parseContentEncoding(this.headers && this.headers["content-type"] || "");
	}

	/**
	 * Returns the user-agent header for this request object, if any.
	 *
	 * @return {string}
	 */
	get useragent() {
		return this.headers["user-agent"] || "";
	}

	/**
	 * Returns a Promise that will resolve when the content body of this
	 * request, if any, is completely read. The resolve returns a Buffer
	 * object. AbstractRequest provides helper functions `readText()` and
	 * `readJSON()` to perform read but return more usable values.
	 *
	 * @return {Promise<Buffer>}
	 */
	read() {
		if (this[$CONTENT]) return Promise.resolve(this[$CONTENT]);

		return new Promise((resolve,reject)=>{
			try {
				let buf = Buffer.alloc(0);
				this.original.on("data",(chunk)=>{
					if (!chunk) return;
					buf = Buffer.concat([buf,chunk]);
				});
				this.original.on("end",()=>{
					this[$CONTENT] = buf;
					resolve(buf);
				});
				this.original.resume();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = HTTPRequest;

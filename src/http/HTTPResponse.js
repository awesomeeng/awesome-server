// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Readable = require("stream").Readable;

const AwesomeUtils =  require("@awesomeeng/awesome-utils");

const AbstractResponse = require("../AbstractResponse");

/**
 * A wrapper for the nodejs http ServerResponse object that is received
 * when an incoming request comes into the server.
 *
 * @extends AbstractRequest
 */
class HTTPResponse extends AbstractResponse {
	/**
	 * Constructor which takes the nodejs http ServerResponse and wraps
	 * it in a custom AbstractRequest object.
	 *
	 * @param {ServerResponse} request
	 */
	constructor(response) {
		super(response);
	}

	/**
	 * Returns true when the response is finished (end() has been called)
	 * and cannot receive any more data/changes.
	 *
	 * @return {boolean}
	 */
	get finished() {
		return this.original.finished;
	}

	/**
	 * Returns the status code set with writeHead for this response.
	 *
	 * @return {number}
	 */
	get statusCode() {
		return this.original.statusCode;
	}

	/**
	 * Returns the headers set with writeHead for this response.
	 * @return {Object}
	 */
	get headers() {
		return this.original.getHeaders();
	}

	/**
	 * Returns the mime-type portion from the Content-Type header.
	 *
	 * @return {String}
	 */
	get contentType() {
		return AwesomeUtils.Request.parseContentType(this.headers && this.headers["Content-Type"] || "");
	}

	/**
	 * Returns the charset (encoding) portion from the Content-Type
	 * header for this response.
	 *
	 * @return {String}
	 */
	get contentEncoding() {
		return AwesomeUtils.Request.parseContentEncoding(this.headers && this.headers["Content-Type"] || "");
	}

	/**
	 * Sets the status code and headers for the response. This may only be
	 * called once per request and cannot be called after a write() or
	 * and end() has been called.
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
	writeHead(/*statusCode,statusMessage,headers*/) {
		return this.original.writeHead.apply(this.original,arguments);
	}

	/**
	 * Writes a chunk of data to the response with the given encoding.
	 *
	 * Returns a Promise that will resolve when the write is complete.
	 * It is always good practice to await a write().
	 *
	 * @param data {(Buffer|string)}
	 * @param encoding {string} optional. Defaults to utf-8.
	 *
	 * @return {Promise}
	 */
	write(data,encoding) {
		return new Promise((resolve,reject)=>{
			try {
				this.original.write(data,encoding,(err)=>{
					if (err) reject(err);
					else resolve();
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * Writes the passed in data to the response with the given encoding
	 * and then marks the response finished.
	 *
	 * Returns a Promise that will resolve when the end is complete.
	 * It is always good practice to await an end().
	 *
	 * @param data {(Buffer|string)}
	 * @param encoding {string} optional. Defaults to utf-8.
	 *
	 * @return {Promise}
	 */
	end(data,encoding) {
		return new Promise((resolve,reject)=>{
			try {
				this.original.end(data,encoding,(err)=>{
					if (err) reject(err);
					else resolve();
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * Pipes the given Readable stream into the response object. writeHead()
	 * should be called prior to this.
	 *
	 * When the pipeFrom() is complete, end() is called and the response
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
	pipeFrom(readable) {
		if (!readable) throw new Error("Missing readable.");
		if (!(readable instanceof Readable)) throw new Error("Invalid readable.");

		return new Promise((resolve,reject)=>{
			try {
				readable.on("end",async ()=>{
					await this.end();
					resolve();
				});
				readable.pipe(this.original,{
					end:false
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = HTTPResponse;

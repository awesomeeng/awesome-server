// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Readable = require("stream").Readable;

const Log = require("@awesomeeng/awesome-log");

const $PARENT = Symbol("parent");
const $STREAM = Symbol("stream");
const $HEADERS = Symbol("headers");
const $CLOSED = Symbol("closed");

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
class PushResponse {
	/**
	 * Factory function. Use this instead of the constructor.
	 *
	 * @param  {HTTP2Response} parent
	 * @param  {Object|null} headers
	 * @return {Promise}
	 */
	static create(parent,headers) {
		return new Promise((resolve,reject)=>{
			try {
				parent.original.createPushResponse(headers||{},(err,stream)=>{
					if (err) return reject(err);
					if (stream && stream.code && stream.code==="ERR_HTTP2_INVALID_STREAM") return reject(new Error("HTTP/2 Stream closed."));

					resolve(new PushResponse(parent,stream,headers));
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * Constructor, but should not be used. use PushResponse.create() instead.
	 *
	 * @constructor
	 * @param {HTTP2Response} parent
	 * @param {*} stream
	 * @param {Object} [headers={}]
	 */
	constructor(parent,stream,headers={}) {
		if (!parent) throw new Error("Missing parent.");
		if (!stream) throw new Error("Missing stream.");
		if (!headers) throw new Error("Missing headers.");

		this[$PARENT] = parent;
		this[$STREAM] = stream;
		this[$HEADERS] = headers;
		this[$CLOSED] = false;

		this.stream.on("close",()=>{
			this[$CLOSED] = true;
		});
		this.stream.stream.on("error",()=>{
			// this event handler must be here or node will die when the error gets swallowed by http2.
			// See https://github.com/nodejs/node/issues/22323
			Log.warn("The client refushed the push stream for "+this.headers[":path"]+".");
		});
	}

	/**
	 * Returns the parent HTTP2 or PushResponse object.
	 *
	 * @return {(HTTP2Response|PushResponse)}
	 */
	get parent() {
		return this[$PARENT];
	}

	/**
	 * Returns the underlying HTTP/2 stream.
	 *
	 * @return {*}
	 */
	get stream() {
		return this[$STREAM];
	}

	/**
	 * Returns the headers object set by writeHead().
	 * @return {Object}
	 */
	get headers() {
		return this[$HEADERS];
	}

	/**
	 * Returns true if this stream has been closed, regardless of how it was closed.
	 * @return {boolean}
	 */
	get closed() {
		return this[$CLOSED];
	}

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
	writeHead(statusCode,statusMessage,headers) {
		if (this.closed) return;

		if (arguments.length===1) [statusCode,statusMessage,headers] = [statusCode,null,null];
		if (arguments.length===2) [statusCode,statusMessage,headers] = [statusCode,null,statusMessage];

		headers = headers || {};
		return this.stream.writeHead(statusCode,statusMessage,headers);
	}

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
	write(data,encoding) {
		if (this.closed) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			try {
				this.stream.write(data,encoding,(err)=>{
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
	end(data,encoding) {
		if (this.closed) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			try {
				this.stream.end(data,encoding,(err)=>{
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
	pipeFrom(readable) {
		if (!readable) throw new Error("Missing readable.");
		if (!(readable instanceof Readable)) throw new Error("Invalid readable.");

		return new Promise((resolve,reject)=>{
			try {
				readable.on("end",async ()=>{
					await this.end();
					resolve();
				});
				readable.on("data",async (chunk)=>{
					await this.write(chunk);
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = PushResponse;

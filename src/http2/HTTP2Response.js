// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP2 = require("http2");
const URL = require("url");
const FS = require("fs");

const Log = require("@awesomeeng/awesome-log");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

const HTTPSResponse = require("../https/HTTPSResponse");
const PushResponse = require("./PushResponse");

const $SERVER_ROOT = Symbol("serverRoot");

/**
 * HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
 * turn extends for HTTPRequest and AbstractRequest.  A lot of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */
class HTTP2Response extends HTTPSResponse {
	/**
	 * @constructor
	 * @param {IncomingMessage} request
	 * @param {ServerResponse} response
	 */
	constructor(request,response) {
		super(response);
		this[$SERVER_ROOT] = request.headers[HTTP2.constants.HTTP2_HEADER_PATH];
	}

	/**
	 * Returns the underlying HTTP/2 stream for this response.
	 *
	 * @return {Http2Stream}
	 */
	get stream() {
		return this.original.stream;
	}

	/**
	 * Returns the relative server root for this incoming request. This allows
	 * the response to send back relative responses.
	 *
	 * @return {string}
	 */
	get serverRoot() {
		return this[$SERVER_ROOT];
	}

	/**
	 * Resolve a given path against the incoming request server root.
	 *
	 * @param  {string} path
	 *
	 * @return {string}
	 */
	resolve(path) {
		return URL.resolve(this.serverRoot,path);
	}

	/**
	 * Returns true if http/2 push is supported.
	 *
	 * @return {boolean}
	 */
	get pushSupported() {
		return this.original.createPushResponse;
	}

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
	push(statusCode,path,contentType,content,headers={}) {
		// If push is not supported, error.
		if (!this.pushSupported) return Promise.reject(new Error("Push not supported."));

		// if we dont have a stream on the original request, we are not http2.
		if (!this.original.stream) return Promise.reject(new Error("Not http2 request, probably downgraded to http1."));

		// argument overloading.
		if (arguments.length===1 && typeof statusCode!=="number") [statusCode,path,contentType,content,headers] = [200,null,"application/json",statusCode,null];
		if (typeof statusCode!=="number") [statusCode,path,contentType,content,headers] = [200,...arguments];

		// some error checking.
		if (!statusCode) throw new Error("Missing status code number.");
		if (typeof statusCode!=="number") throw new Error("Invalid status code number.");
		if (!contentType) throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (content===undefined) throw new Error("Missing content.");

		// return a promise, then do our push.
		return new Promise(async (resolve,reject)=>{
			try {
				// Log that we are pushing content.
				Log.info("Pushed to client: "+path);

				// set respone properties including lots of HTTP@ special headers.
				headers = headers || {};
				headers[HTTP2.constants.HTTP2_HEADER_STATUS] = headers[HTTP2.constants.HTTP2_HEADER_STATUS] || 200;
				headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] = headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] || contentType;
				headers[HTTP2.constants.HTTP2_HEADER_PATH] = headers[HTTP2.constants.HTTP2_HEADER_PATH] || this.resolve(path);
				headers[HTTP2.constants.HTTP2_HEADER_METHOD] = headers[HTTP2.constants.HTTP2_HEADER_METHOD] || "GET";
				headers[HTTP2.constants.HTTP2_HEADER_SCHEME] = headers[HTTP2.constants.HTTP2_HEADER_SCHEME] || "https";

				// create a PushResponse object, to senf the push.
				let pusher = await PushResponse.create(this,headers);

				// write the head to the push
				pusher.writeHead(statusCode);

				// write the content to the push.
				await pusher.write(content);

				// end the push.
				await pusher.end();

				// resolve the promise man.
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

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
	pushText(statusCode,path,content,headers) {
		return this.push(statusCode,path,"text/plain",content,headers);
	}

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
	pushCSS(statusCode,path,content,headers) {
		return this.push(statusCode,path,"text/css",content,headers);
	}

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
	pushHTML(statusCode,path,content,headers) {
		return this.push(statusCode,path,"text/html",content,headers);
	}

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
	pushJSON(statusCode,path,content,headers) {
		if (typeof content!=="string") content = JSON.stringify(content);
		return this.push(statusCode,path,"application/json",content,headers);
	}

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
	pushServe(statusCode,path,contentType,filename,headers) {
		// if push not supported, error.
		if (!this.pushSupported) return Promise.reject(new Error("Push not supported."));

		// IF we got downgraded, return
		if (!this.original.stream) return Promise.reject(new Error("Not http2 request, probably downgraded to http1."));

		// argument overloading
		if (arguments.length===1 && typeof statusCode!=="number") [statusCode,path,contentType,filename,headers] = [200,null,null,statusCode,null];
		if (typeof statusCode!=="number") [statusCode,path,contentType,filename,headers] = [200,...arguments];

		// validate incoming arguments
		if (!statusCode) throw new Error("Missing status code number.");
		if (typeof statusCode!=="number") throw new Error("Invalid status code number.");
		if (!contentType) throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (!filename) throw new Error("Missing filename.");

		// return promise, then push
		return new Promise(async (resolve,reject)=>{
			try {
				// If the file doesnt exist, just fail fast.
				if (!AwesomeUtils.FS.existsSync(filename)) throw new Error("File not found: "+filename);

				// Log that we are pushing.
				Log.info("Pushed to client "+path+" from "+filename);

				// we actually want two sets of headers, one for creating
				// the pushResponse, and one for sending to writeHead. The
				// diff between the two is the latter cannot have http2 headers
				// in it.
				headers = headers || {};
				headers[HTTP2.constants.HTTP2_HEADER_STATUS] = headers[HTTP2.constants.HTTP2_HEADER_STATUS] || 200;
				headers[HTTP2.constants.HTTP2_HEADER_PATH] = headers[HTTP2.constants.HTTP2_HEADER_PATH] || this.resolve(path);
				headers[HTTP2.constants.HTTP2_HEADER_METHOD] = headers[HTTP2.constants.HTTP2_HEADER_METHOD] || "GET";
				headers[HTTP2.constants.HTTP2_HEADER_SCHEME] = headers[HTTP2.constants.HTTP2_HEADER_SCHEME] || "https";
				headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] = headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] || contentType;
				let h2headers = {};
				Object.keys(headers).forEach((key)=>{
					if (key.startsWith(":")) {
						h2headers[key] = headers[key];
						delete headers[key];
					}
				});

				// create a stream for reading and piping.
				let stream = FS.createReadStream(filename);

				// Create out Push Response.
				let pusher = await PushResponse.create(this,h2headers);

				// write head
				pusher.writeHead(statusCode,headers);
				
				// Pipe
				await pusher.pipeFrom(stream);
				// no end because the pipeFrom will do it for us.

				// resolve our promise dude.
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = HTTP2Response;

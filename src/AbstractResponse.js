// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// External dependencies
const FS = require("fs");
const AwesomeUtils = require("@awesomeeng/awesome-utils");

// Define our symbols for privacy.
const $ORIGINAL = Symbol("original");

/**
 * Describes the required shape of all response objects passed to AwesomeServer
 * by an AbstractServer.
 *
 * The following functions are required to be implemented by
 * extending classes:
 *
 * 		get original()
 * 		get finished()
 * 		get statusCode()
 * 		get contentType()
 * 		get contentEncoding()
 * 		get pushSupported()
 * 		writeHead()
 * 		write()
 * 		end()
 * 		pipeFrom()
 *
 * Provides the convenience methods:
 *
 * 		writeText()
 * 		writeHTML()
 * 		writeCSS()
 * 		writeJSON()
 * 		writeError()
 * 		serve()
 *
 */
class AbstractResponse {
	/**
	 * Creates an AbstractResponse which wraps an originalResponse object.
	 *
	 * @param {*} originalResponse
	 */
	constructor(originalResponse) {
		this[$ORIGINAL] = originalResponse;
	}

	/**
	 * Returns the original, underlying response object, whatever that might be.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {*}
	 */
	get original() {
		return this[$ORIGINAL];
	}

	/**
	 * Returns true if the end() method has been called and this request is
	 * closed to further writes.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {boolean}
	 */
	get finished() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Returns the response status code, if one has been set, for this
	 * response.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {number}
	 */
	get statusCode() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Returns the response mime-type portion of the content-type
	 * header, if one has been set.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {string}
	 */
	get contentType() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Returns the response charset (encoding) portion of the content-type
	 * header, if one has been set.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {string}
	 */
	get contentEncoding() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * True if push() and push...() functions are supported by this response
	 * object. This is generally only true when the request supports bi-directional
	 * flow, such as HTTP/2.
	 *
	 * @return {boolean} true if push() and push...() functions are supported.
	 */
	get pushSupported() {
		return false;
	}

	/**
	 * Set a header for outgoing requests. Any header set via setHeader()
	 * is merged with any headers set by writeHead() before the final response
	 * is sent.
	 *
	 * @param {string} name 
	 * @param {string} value
	 */
	setHeader(/*name,value*/) {
		throw new Error("To be implemented by subclass.");
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
		throw new Error("To be implemented by subclass.");
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
	write(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
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
	end(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
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
	pipeFrom(/*readable*/) {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * A convenience method for writing a JSON string or object converted to
	 * JSON to the response. This method will perform the writeHead(), the
	 * write(), and the end() all in one.
	 *
	 * If the passed in content is a string, it is assumed to be JSON. Any
	 * thing else passed in will be converted to json (via JSON.stringify())
	 * and then sent.
	 *
	 * Returns a Promise that will resolve on end().
	 *
	 * @param  {number} statusCode
	 * @param  {(*|string)} content
	 * @param  {(Object|null)} [headers=null]
	 * @return {Promise}
	 */
	writeJSON(statusCode,content,headers=null) {
		// argument overloading
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null) throw new Error("Missing content.");

		// Set our response properties.
		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "application/json";
		statusCode = statusCode || 200;

		// turn it into json if not already so.
		if (typeof content!=="string") content = JSON.stringify(content);

		// write the header
		this.writeHead(statusCode,headers);

		// write content and end.
		return this.end(content);
	}

	/**
	 * A convenience method for writing plain text to the response with the
	 * content-type "text/plain".
	 * This method will perform the writeHead(), the write(), and the end()
	 * all in one.
	 *
	 * Returns a Promise that will resolve on end().
	 *
	 * @param  {number} statusCode
	 * @param  {string} content
	 * @param  {(Object|null)} [headers=null]
	 * @return {Promise}
	 */
	writeText(statusCode,content,headers=null) {
		// argument overloading
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null) throw new Error("Missing content.");

		// set response properties
		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/plain; charset=utf-8";
		statusCode = statusCode || 200;

		// write head
		this.writeHead(statusCode,headers);

		// write content and end.
		return this.end(content);
	}

	/**
	 * A convenience method for writing CSS to the response with the content-type
	 * "text/css".
	 * This method will perform the writeHead(), the write(), and the end()
	 * all in one.
	 *
	 * Returns a Promise that will resolve on end().
	 *
	 * @param  {number} statusCode
	 * @param  {string} content
	 * @param  {(Object|null)} [headers=null]
	 * @return {Promise}
	 */
	writeCSS(statusCode,content,headers=null) {
		// argument overloading
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null) throw new Error("Missing content.");

		// set reponse properties
		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/css; charset=utf-8";
		statusCode = statusCode || 200;

		// write head
		this.writeHead(statusCode,headers);

		// write content and end.
		return this.end(content);
	}

	/**
	 * A convenience method for writing HTML to the response with the
	 * content-type "text/html".
	 * This method will perform the writeHead(), the write(), and the end()
	 * all in one.
	 *
	 * Returns a Promise that will resolve on end().
	 *
	 * @param  {number} statusCode
	 * @param  {string} content
	 * @param  {(Object|null)} [headers=null]
	 * @return {Promise}
	 */
	writeHTML(statusCode,content,headers=null) {
		// argument overloading
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null) throw new Error("Missing content.");

		// set response properties
		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/html; charset=utf-8";
		statusCode = statusCode || 200;

		// write head
		this.writeHead(statusCode,headers);

		// write content and end.
		return this.end(content);
	}

	/**
	 * A convenience method for writing and error message to the response.
	 * The content-type for this is "text/plain".
	 * This method will perform the writeHead(), the write(), and the end()
	 * all in one.
	 *
	 * If the content argument is an instance of Error, this method will
	 * format the text from the Error.message and Error.stack members.
	 *
	 * Returns a Promise that will resolve on end().
	 *
	 * @param  {number} statusCode
	 * @param  {(string|Error)} content
	 * @param  {(Object|null)} [headers=null]
	 * @return {Promise}
	 */
	writeError(statusCode,content=null,headers=null) {
		// argument overloading.
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];

		// set response properties.
		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/plain; charset=utf-8";
		statusCode = statusCode || 200;

		// If we have a stack trace, that's the content.
		// If we also have a cause, include that.
		if (content && content instanceof Error && content.stack) {
			content = content.message+"\n\n"+content.stack;
			if (content.cause) content += "\n\n"+content.cause;
		}
		else if (content && content instanceof Error) content = content.message;

		// write head
		this.writeHead(statusCode,headers);

		// write content (if any) and end.
		return content!==undefined && content!==null ? this.end(content) : this.end();
	}

	/**
	 * A convenience method for serving a specific file as the response. You
	 * supply the filename and this method will take care of the rest. The
	 * filename given must be valid file path and must exist or an error
	 * will be thrown.  This function will not resolve relative filenames
	 * the way that AwesomeServer will, so its best to use
	 * AwesomeServer.resolve() first yourself.
	 * This method will perform the writeHead(), the write(), and the end()
	 * all in one.
	 *
	 * Returns a Promise that will resolve on end().
	 *
	 * @param  {number} statusCode
	 * @param  {string} content
	 * @param  {(Object|null)} [headers=null]
	 * @return {Promise}
	 */
	serve(statusCode,contentType,filename,headers=null) {
		// argument overloading
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,contentType,filename,headers] = [200,...arguments];
		if (contentType===undefined || contentType===null || contentType==="") throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (filename===undefined || filename===null || filename==="") throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		// set response properties
		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || contentType;
		statusCode = statusCode || 200;

		// if the file is not found, 404.
		if (!AwesomeUtils.FS.existsSync(filename)) {
			this.writeHead(404,{
				"content-type": "text/plain"
			});
			return this.end("Not Found: "+filename);
		}

		// write head
		this.writeHead(statusCode,headers);

		// create a stream for the file and pipe to response.
		// Look at us go!
		let stream = FS.createReadStream(filename);
		return this.pipeFrom(stream);
	}
}

module.exports = AbstractResponse;

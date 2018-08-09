// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $ORIGINAL = Symbol("original");

/**
 * Describes the required shape of all request objects passed to AwesomeServer
 * by an AbstractServer.
 *
 * The following functions are required to be implemented by
 * extending classes:
 *
 * 		get origin()
 * 		get method()
 * 		get url()
 * 		get path()
 * 		get query()
 * 		get querystring()
 * 		get headers()
 * 		get contentType()
 * 		get contentEncoding()
 * 		get useragent()
 * 		read()
 *
 * Provides the convenience methods:
 *
 * 		readText()
 * 		readJSON()
 *
 */
class AbstractRequest {
	/**
	 * Creates an AbstractRequest which wraps an originalRequest object.
	 *
	 * @param {*} originalRequest
	 */
	constructor(originalRequest) {
		this[$ORIGINAL] = originalRequest;
	}

	/**
	 * Returns the original, underlying request object, whatever that might be.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {*}
	 */
	get original() {
		return this[$ORIGINAL];
	}

	/**
	* Returns the origin, as a string, of where the request is coming from, if that
	* information makes sense and is possible to return. Returns an empty string otherwise.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get origin() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the HTTP Method for this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get method() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the URL (as a nodejs URL object) of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {URL}
	*/
	get url() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the path, usually taken from the url, of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get path() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the query/search portion of te url as a fully parsed query
	* object (usualy via nodejs querystring) of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {Object}
	*/
	get query() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the query/search portion of the url as a string.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get querystring() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the headers for this request as a parsed object. All header
	* keys must be lowercased.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {Object}
	*/
	get headers() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the mime-type portion of the content-type of this request,
	* usually from the haders.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get contentType() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the charset (content encoding) portion of the content-type
	* of this request, usually from the headers.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get contentEncoding() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns the user-agent string for this request, usually from the headers.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	get useragent() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	* Returns a Promise that resolves with a Buffer that contains the
	* entire body content of the request, if any, or null if not.
	*
	* This must resolve with null or a Buffer. Do not resolve with a string.
	*
	* @return {type}
	*/
	read() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * Conveience method to read the body content of the request as
	 * as plain text string using the given encoding (or utf-8 if
	 * no encoding is given).
	 *
	 * Returns a Promise that will resolve when the content is read
	 * as a string.
	 *
	 * @param  {String} [encoding="utf-8"]
	 * @return {Promise}
	 */
	readText(encoding="utf-8") {
		return new Promise(async (resolve,reject)=>{
			try {
				let content = await this.read();
				resolve(content.toString(encoding));
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * Convenience method to read the body content of the request as
	 * a text string using the given encoding (or utf-8 if no encoding is given)
	 * and then parse it as json.
	 *
	 * Returns a Promise that will resolve when the content is read as a
	 * string and then parsed as json. Will reject if the parse fails.
	 *
	 * @param  {String} [encoding="utf-8"]
	 * @return {Promise}
	 */
	readJSON(encoding="utf-8") {
		return new Promise(async (resolve,reject)=>{
			try {
				let content = await this.readText(encoding);
				resolve(JSON.parse(content));
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = AbstractRequest;

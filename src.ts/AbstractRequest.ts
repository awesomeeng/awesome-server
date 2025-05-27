// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

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
export abstract class AbstractRequest {
	private [$ORIGINAL]: unknown;

	/**
	 * Creates an AbstractRequest which wraps an originalRequest object.
	 *
	 * @param {unknown} originalRequest
	 */
	constructor(originalRequest: unknown) {
		this[$ORIGINAL] = originalRequest;
	}

	/**
	 * Returns the original, underlying request object, whatever that might be.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {unknown}
	 */
	get original(): unknown {
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
	abstract get origin(): string;

	/**
	* Returns the HTTP Method for this request. This must be
	* an all upper case string.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	abstract get method(): string;

	/**
	* Returns the URL (as a nodejs URL object) of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {URL}
	*/
	abstract get url(): URL;

	/**
	* Returns the path, usually taken from the url, of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	abstract get path(): string;

	/**
	* Returns the query/search portion of te url as a fully parsed query
	* object (usualy via nodejs querystring) of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {Record<string, string | string[]>}
	*/
	abstract get query(): Record<string, string | string[]>;

	/**
	* Returns the querystring portion of the url of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	abstract get querystring(): string;

	/**
	* Returns a Map of all headers associated with this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {Map<string, string>}
	*/
	abstract get headers(): Map<string, string>;

	/**
	* Returns the content type header of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	abstract get contentType(): string;

	/**
	* Returns the content encoding header of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	abstract get contentEncoding(): string;

	/**
	* Returns the user agent string of this request.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {string}
	*/
	abstract get useragent(): string;

	/**
	* Returns a Promise that will resolve with the content of this request.
	* The content is raw and untouched.  Use readText() or readJSON() for
	* convenience functions that parse the content.
	*
	* It is up to the implementor on how this is obtained.
	*
	* @return {Promise<Buffer>}
	*/
	abstract read(): Promise<Buffer>;

	/**
	* Returns a Promise that will resolve with the content of this request
	* converted to a string.
	*
	* @return {Promise<string>}
	*/
	async readText(): Promise<string> {
		const content = await this.read();
		return content.toString();
	}

	/**
	* Returns a Promise that will resolve with the content of this request
	* parsed as JSON.
	*
	* @return {Promise<unknown>}
	*/
	async readJSON(): Promise<unknown> {
		const text = await this.readText();
		return JSON.parse(text);
	}
}

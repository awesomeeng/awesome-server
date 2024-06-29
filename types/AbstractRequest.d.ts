export = AbstractRequest;
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
declare class AbstractRequest {
    /**
     * Creates an AbstractRequest which wraps an originalRequest object.
     *
     * @param {*} originalRequest
     */
    constructor(originalRequest: any);
    /**
     * Returns the original, underlying request object, whatever that might be.
     *
     * It is up to the implementor on how this is obtained.
     *
     * @return {*}
     */
    get original(): any;
    /**
    * Returns the origin, as a string, of where the request is coming from, if that
    * information makes sense and is possible to return. Returns an empty string otherwise.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get origin(): string;
    /**
    * Returns the HTTP Method for this request. This must be
    * an all upper case string.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get method(): string;
    /**
    * Returns the URL (as a nodejs URL object) of this request.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {URL}
    */
    get url(): URL;
    /**
    * Returns the path, usually taken from the url, of this request.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get path(): string;
    /**
    * Returns the query/search portion of te url as a fully parsed query
    * object (usualy via nodejs querystring) of this request.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {Object}
    */
    get query(): any;
    /**
    * Returns the query/search portion of the url as a string.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get querystring(): string;
    /**
    * Returns the headers for this request as a parsed object. All header
    * keys must be lowercased.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {Object}
    */
    get headers(): any;
    /**
    * Returns the mime-type portion of the content-type of this request,
    * usually from the haders.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get contentType(): string;
    /**
    * Returns the charset (content encoding) portion of the content-type
    * of this request, usually from the headers.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get contentEncoding(): string;
    /**
    * Returns the user-agent string for this request, usually from the headers.
    *
    * It is up to the implementor on how this is obtained.
    *
    * @return {string}
    */
    get useragent(): string;
    /**
    * Returns a Promise that resolves with a Buffer that contains the
    * entire body content of the request, if any, or null if not.
    *
    * This must resolve with null or a Buffer. Do not resolve with a string.
    *
    * @return {type}
    */
    read(): type;
    /**
     * Given some pattern, return the matching positional parameters
     * from the path.  If path is supplied as an argument, use that. If
     * path is not supplied, use the current url path.
     *
     * Pattern uses the standard format used by most nodejs REST
     * frameworks:
     *
     * 		/test/:id/:value
     *
     * Where any name that starts with a colon is a positional
     * parameter.  Names must use only the A-Z, a-z, 0-9, or _
     * characters.
     *
     * The pattern must be an exact match.
     *
     * If the pattern does not match, null is returned.
     *
     * @param  {string} pattern
     * @param  {undefined|null|string} path
     * @return {null|Object}
     */
    positional(pattern: string, path: undefined | null | string): null | any;
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
    readText(encoding?: string): Promise<any>;
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
    readJSON(encoding?: string): Promise<any>;
}

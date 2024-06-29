export = HTTPRequest;
/**
 * A wrapper for the nodejs http IncomingMessage object that is received
 * when an incoming request comes into the server.
 *
 * @extends AbstractRequest
 */
declare class HTTPRequest extends AbstractRequest {
    /**
     * Returns the URL object for this request.
     *
     * @return {URL}
     */
    get url(): URL;
    /**
     * Returns a Promise that will resolve when the content body of this
     * request, if any, is completely read. The resolve returns a Buffer
     * object. AbstractRequest provides helper functions `readText()` and
     * `readJSON()` to perform read but return more usable values.
     *
     * @return {Promise<Buffer>}
     */
    read(): Promise<Buffer>;
}
import AbstractRequest = require("../AbstractRequest");

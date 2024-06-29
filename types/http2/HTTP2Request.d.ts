export = HTTP2Request;
/**
 * HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
 * turn extends from HTTPRequest and AbstractRequest.  Most of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */
declare class HTTP2Request extends HTTPSRequest {
}
import HTTPSRequest = require("../https/HTTPSRequest");

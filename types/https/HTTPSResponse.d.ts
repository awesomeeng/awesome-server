export = HTTPSResponse;
/**
 * HTTPS Response wrapper class. Extends from HTTPRequest which in
 * turn extends from AbstractRequest.  Most of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */
declare class HTTPSResponse {
    /**
     * @constructor
     * @param {ServerResponse} response
     */
    constructor(response: ServerResponse);
}

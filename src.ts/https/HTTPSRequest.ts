// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { IncomingMessage } from "http";
import { HTTPRequest } from "../http/HTTPRequest";

/**
 * HTTPS Request wrapper class. Extends from HTTPRequest which in
 * turn extends from AbstractRequest.  Most of the
 * details is in HTTPRequest.
 *
 * @extends HTTPRequest
 */
export class HTTPSRequest extends HTTPRequest {
    /**
     * @constructor
     * @param {IncomingMessage} request 
     */
    constructor(request: IncomingMessage) {
        super(request);
    }
}

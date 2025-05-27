// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { ServerResponse } from "http";
import { HTTPResponse } from "../http/HTTPResponse";

/**
 * HTTPS Response wrapper class. Extends from HTTPResponse which in
 * turn extends from AbstractResponse.  Most of the
 * details is in HTTPResponse.
 *
 * @extends HTTPResponse
 */
export class HTTPSResponse extends HTTPResponse {
    /**
     * @constructor
     * @param {ServerResponse} response
     */
    constructor(response: ServerResponse) {
        super(response);
    }
}

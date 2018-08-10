// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPResponse = require("../http/HTTPResponse");

/**
 * HTTPS Response wrapper class. Extends from HTTPRequest which in
 * turn extends from AbstractRequest.  Most of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */

class HTTPSResponse extends HTTPResponse{
	/**
	 * @constructor
	 * @param {ServerResponse} response
	 */
	constructor(response) {
		super(response);
	}
}

module.exports = HTTPSResponse;

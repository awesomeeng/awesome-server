// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPRequest = require("../http/HTTPRequest");

/**
 * HTTPS Request wrapper class. Extends from HTTPRequest which in
 * turn extends from AbstractRequest.  Most of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */
class HTTPSRequest extends HTTPRequest{
	/**
	 * @constructor
	 * @param {IncomingRequest} request 
	 */
	constructor(request) {
		super(request);
	}
}

module.exports = HTTPSRequest;

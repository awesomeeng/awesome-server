// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPSRequest = require("../https/HTTPSRequest");

/**
 * HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
 * turn extends from HTTPRequest and AbstractRequest.  Most of the
 * details is in HTTPRequest.
 *
 * @extends HTTPSRequest
 */
class HTTP2Request extends HTTPSRequest{
	/**
	 * @constructor
	 * @param {IncomingMessage} request
	 * @param {ServerResponse} response
	 */
	constructor(request/*,response*/) {
		super(request);
	}
}

module.exports = HTTP2Request;

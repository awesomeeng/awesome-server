// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPRequest = require("../http/HTTPRequest");

class HTTPSRequest extends HTTPRequest{
	constructor(request) {
		super(request);
	}
}

module.exports = HTTPSRequest;

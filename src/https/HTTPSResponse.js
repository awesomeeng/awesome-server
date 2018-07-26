// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPResponse = require("../http/HTTPResponse");

class HTTPSResponse extends HTTPResponse{
	constructor(request) {
		super(request);
	}
}

module.exports = HTTPSResponse;

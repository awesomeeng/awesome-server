// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPResponse = require("../http/HTTPResponse");

class HTTPSResponse extends HTTPResponse{
	constructor(response) {
		super(response);
	}
}

module.exports = HTTPSResponse;

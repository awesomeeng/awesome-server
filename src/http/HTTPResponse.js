// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractResponse = require("../AbstractResponse");

class HTTPResponse extends AbstractResponse {
	constructor(original) {
		super(original);
	}
}

module.exports = HTTPResponse;

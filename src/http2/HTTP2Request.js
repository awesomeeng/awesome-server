// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTPSRequest = require("../https/HTTPSRequest");

class HTTP2Request extends HTTPSRequest{
	constructor(request/*,response*/) {
		super(request);
	}
}

module.exports = HTTP2Request;

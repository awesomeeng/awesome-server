// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeServer = require("../../../src/AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;

class ControllerOne extends AbstractController {
	constructor() {
		super();
	}

	get(path,request,response) {
		response.writeText("Controller One says Hello!");
	}
}

module.exports = ControllerOne;

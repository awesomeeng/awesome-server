// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeServer = require("../../../../src/AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;

class ControllerThreeOne extends AbstractController {
	constructor() {
		super();
	}

	get(path,request,response) {
		response.writeText("Controller Three One says Hello!");
	}
}

module.exports = ControllerThreeOne;

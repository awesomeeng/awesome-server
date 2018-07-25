// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeServer = require("../../../src/AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;

class ControllerTwo extends AbstractController {
	constructor() {
		super();
	}

	get(path,request,response) {
		response.writeText("Controller Two says Hello!");
	}
}

module.exports = ControllerTwo;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeServer = require("AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;

class ControllerTwo extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller Two says Hello!");
	}
}

module.exports = ControllerTwo;

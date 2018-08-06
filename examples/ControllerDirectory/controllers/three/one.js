// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeServer = require("AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;

class ControllerThreeOne extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller Three One says Hello!");
	}
}

module.exports = ControllerThreeOne;

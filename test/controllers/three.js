// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeServer = require("@awesomeeng/awesome-server");
const AbstractController = AwesomeServer.AbstractController;

class ControllerThree extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller Three says Hello!");
	}
}

module.exports = ControllerThree;

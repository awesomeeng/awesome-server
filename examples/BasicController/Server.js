// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("../../src/AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;

class MyController extends AbstractController {
	constructor() {
		super();
	}

	get(path,request,response) {
		response.writeText("Controller "+path);
	}

	post(path,request,response) {
		response.writeText("Glen is awesome.");
	}
}

let server = new AwesomeServer();
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
server.router.add("/hello",new MyController());
server.start();

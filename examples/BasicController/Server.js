// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("awesome-log");
Log.start();

const AwesomeServer = require("awesome-server");
const AbstractController = AwesomeServer.AbstractController;

class MyController extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller "+request.url.href);
	}

	async post(path,request,response) {
		await response.writeText("Controllers are awesome.");
	}
}

let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
});
server.route("/hello",new MyController());
server.start();

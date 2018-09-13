// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("awesome-log");
Log.start();

const AwesomeServer = require("awesome-server");

let server = new AwesomeServer();
server.addHTTPSServer({
	host: "localhost",
	port: 7443,
	cert: server.resolve("./certificate.pub"), // load our cert relative to this Server.js file.
	key: server.resolve("./certificate.key") // load our key relative to this Server.js file.
});
server.route("*","/hello",async (path,request,response)=>{
	await response.writeText("Hello world.");
});
server.start();

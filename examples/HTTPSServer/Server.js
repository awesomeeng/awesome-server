// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("AwesomeServer");

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

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("AwesomeServer");

let server = new AwesomeServer();
server.addHTTPSServer({
	hostname: "localhost",
	port: 7443,
	cert: AwesomeServer.resolveRelativeToModule(module,"./certificate.pub"), // load our cert relative to this Server.js file.
	key: AwesomeServer.resolveRelativeToModule(module,"./certificate.key") // load our key relative to this Server.js file.
});
server.router.add("*","/hello",async (path,request,response)=>{
	await response.writeText("Hello world.");
});
server.start();

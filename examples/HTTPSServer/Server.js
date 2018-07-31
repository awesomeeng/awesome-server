// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");
const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("../../src/AwesomeServer");

let server = new AwesomeServer();
server.addHTTPSServer({
	hostname: "localhost",
	port: 7443,
	cert: AwesomeUtils.Module.resolve(module,"./certificate.pub"), // load our cert relative to this Server.js file.
	key: AwesomeUtils.Module.resolve(module,"./certificate.key") // load our key relative to this Server.js file.
});
server.router.add("*","/hello",(request,response)=>{
	response.writeText("Hello world.");
});
server.start();

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("../../src/AwesomeServer");

let server = new AwesomeServer();
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
server.router.prefix = "/api";
server.router.add(AwesomeUtils.Module.resolve(module,"./controllers"));
server.start();

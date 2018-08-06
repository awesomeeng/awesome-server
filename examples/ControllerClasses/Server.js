// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("AwesomeServer");

let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
});
server.router.addControllerFile("/one",AwesomeServer.resolveRelativeToModule(module,"./ControllerOne"));
server.router.addControllerFile("/two",AwesomeServer.resolveRelativeToModule(module,"./ControllerTwo"));
server.start();

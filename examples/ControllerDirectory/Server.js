// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("@awesomeeng/awesome-log");
Log.start();

const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
});
server.route("*","/api","./controllers");
server.start();

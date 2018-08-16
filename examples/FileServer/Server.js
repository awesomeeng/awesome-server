// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.start();

const AwesomeServer = require("AwesomeServer");

let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
});

server.start();

// Serve a directory of files
server.serve("/hello","./files");

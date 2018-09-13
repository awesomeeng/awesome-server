// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("awesome-log");
Log.start();

const AwesomeServer = require("awesome-server");

let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
});

server.start();

// Serve a directory of files
server.serve("/hello","./files");

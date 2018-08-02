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

server.start();

// Serve specific files
// server.router.addServe("/hello",AwesomeUtils.Module.resolve(module,"./files/index.html"));
// server.router.addServe("/hello/hello.css",AwesomeUtils.Module.resolve(module,"./files/hello.css"));

// Serve a directory of files
server.router.addServeDirectory("/hello",AwesomeUtils.Module.resolve(module,"./files"));

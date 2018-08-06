// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("AwesomeServer");

let server = new AwesomeServer();
server.addHTTP2Server({
	host: "localhost",
	port: 7443,
	cert: AwesomeServer.resolveRelativeToModule(module,"./certificate.pub"), // load our cert relative to this Server.js file.
	key: AwesomeServer.resolveRelativeToModule(module,"./certificate.key") // load our key relative to this Server.js file.
});
server.start();

/*
	Serve specific files with http/2 pushing and fallback
 */

// Fallback and serve the CSS straight up if the http2 stuff doesnt work for some reason.
server.router.addServe("/hello/hello.css",AwesomeServer.resolveRelativeToModule(module,"./files/hello.css"));

// Push our CSS to any page that matches /hello or /hello/*
server.router.addPushServe("/hello/*","/hello/hello.css",AwesomeServer.resolveRelativeToModule(module,"./files/hello.css"));
server.router.addPushServe("/hello","/hello/hello.css",AwesomeServer.resolveRelativeToModule(module,"./files/hello.css"));

// Serve our basic html page at /hello. Because of the prior push rules, this will also include the pushed css file.
server.router.addServe("/hello",AwesomeServer.resolveRelativeToModule(module,"./files/index.html"));

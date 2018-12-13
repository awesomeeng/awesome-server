// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("@awesomeeng/awesome-log");
Log.start();

const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTP2Server({
	hostname: "localhost",
	port: 7443,
	cert: server.resolve("./certificate.pub"), // load our cert relative to this Server.js file.
	key: server.resolve("./certificate.key") // load our key relative to this Server.js file.
});
server.route("*","*",(path,request)=>{
	Log.access("Request from "+request.origin+" for "+request.url.href);
});
server.start();

/*
	Serve specific files with http/2 pushing and fallback
 */

// Fallback and serve the CSS straight up if the http2 stuff doesnt work for some reason.
server.serve("/hello/hello.css",server.resolve("./files/hello.css"));

// Push our CSS to any page that matches /hello or /hello/*
server.push("/hello/*","/hello/hello.css",server.resolve("./files/hello.css"));
server.push("/hello","/hello/hello.css",server.resolve("./files/hello.css"));

// Serve our basic html page at /hello. Because of the prior push rules, this will also include the pushed css file.
server.serve("/hello",server.resolve("./files/index.html"));
server.serve("/hello/index.html",server.resolve("./files/index.html")); // sometimes firefox likes to help and redirect to index.html. this works around that.

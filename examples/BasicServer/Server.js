// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("@awesomeeng/awesome-log");
Log.init({
	buffering: true
});
Log.start();

const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
server.route("*","*",(path,request)=>{
	Log.access("Request from "+request.origin+" for "+request.url.href);
});
server.route("*","/hello",(path,request,response)=>{
	return response.writeText("Hello world.");
});
server.start();

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("@awesomeeng/awesome-log");
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

// route one
server.route("*","*",(path,request,response)=>{
	response.writeHead(200);
});

// route two
server.route("*","*hello*",async (path,request,response)=>{
	await response.write("Hello\n");
});

// route three
server.route("*","*world*",async (path,request,response)=>{
	await response.write("World\n");
});

// route four
server.route("*","*",async (path,request,response)=>{
	await response.end();
});

server.start();

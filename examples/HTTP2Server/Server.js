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
server.route("*","/hello",(path,request,response)=>{
	return new Promise(async (resolve,reject)=>{
		try {
			await response.push("/index1.css","text/css","p { font-size:48px; color: red; }");
			await response.push("/index2.css","text/css","p { font-weight: bold; }");
			setTimeout(async ()=>{
				await response.writeHTML("<html><head><link rel='stylesheet' type='text/css' href='index1.css'><link rel='stylesheet' type='text/css' href='index2.css'></head><body><p>Hello world.</p></body></html>");
				await response.end();

				resolve();
			},2000);
		}
		catch (ex) {
			return reject(ex);
		}
	});

});
server.start();

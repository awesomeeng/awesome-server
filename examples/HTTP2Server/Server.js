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
server.router.add("*","/hello",(path,request,response)=>{
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

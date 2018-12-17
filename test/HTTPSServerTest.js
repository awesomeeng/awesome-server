// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
// require("AwesomeLog").init().start();

const AwesomeServer = require("../src/AwesomeServer");
const AbstractServer = require("../src/AbstractServer");
const AbstractRequest = require("../src/AbstractRequest");
const AbstractResponse = require("../src/AbstractResponse");
const HTTPSServer = require("../src/https/HTTPSServer");
const HTTPSRequest = require("../src/https/HTTPSRequest");
const HTTPSResponse = require("../src/https/HTTPSResponse");

describe("HTTPSServer",function(){
	let server,port,url;

	beforeEach(async function(){
		server = new AwesomeServer();
		port = await AwesomeUtils.Net.randomPort();
		url = "https://localhost:"+port;

		server.addHTTPSServer({
			hostname: "localhost",
			port,
			cert: server.resolve("./certificate.pub"), // load our cert relative to this Server.js file.
			key: server.resolve("./certificate.key") // load our key relative to this Server.js file.
		});
		await server.start();
	});

	afterEach(async function() {
		await server.stop();
	});

	it("Started",function(){
		assert(server.running);
		assert.equal(server.servers.length,1);
		assert(server.servers[0] instanceof AbstractServer);
		assert(server.servers[0] instanceof HTTPSServer);
		assert(server.servers[0].running);
		assert(AwesomeUtils.Net.portInUse(port));
	});

	it("Request",async function(){
		let req;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});
		await AwesomeUtils.Request.get(url+"/test",null,{
			rejectUnauthorized: false
		});

		assert(req);
		assert(req instanceof AbstractRequest);
		assert(req instanceof HTTPSRequest);
	});

	it("Response",async function(){
		let resp;
		server.route("*","/test",async (path,request,response)=>{
			resp = response;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});

		await AwesomeUtils.Request.get(url+"/test",null,{
			rejectUnauthorized: false
		});

		assert(resp);
		assert(resp instanceof AbstractResponse);
		assert(resp instanceof HTTPSResponse);
	});

	it("get request",async function(){
		let req;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});

		let response = await AwesomeUtils.Request.get(url+"/test",null,{
			rejectUnauthorized: false
		});

		assert(req);
		assert.equal(req.method,"GET");
		assert.equal(req.url.href,"/test");
		assert.equal(req.path,"/test");

		assert(response);
		assert.equal(response.statusCode,200);
		assert.equal(response.contentType,"text/plain");
		assert.equal(response.contentEncoding,"utf-8");

		assert.equal(await response.content,"the quick brown fox jumped over the lazy dog.");
	});

	it("post request",async function(){
		let req;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			let body = await request.readText();
			await response.writeText(body);
		});

		let response = await AwesomeUtils.Request.post(url+"/test","text/plain","Come, my friends, / 'Tis not too late to seek a newer world. / Push off, and sitting well in order smite / The sounding furrow",null,{
			rejectUnauthorized: false
		});

		assert(req);
		assert.equal(req.method,"POST");
		assert.equal(req.url.href,"/test");
		assert.equal(req.path,"/test");

		assert(response);
		assert.equal(response.statusCode,200);
		assert.equal(response.contentType,"text/plain");
		assert.equal(response.contentEncoding,"utf-8");

		assert.equal(await response.content,"Come, my friends, / 'Tis not too late to seek a newer world. / Push off, and sitting well in order smite / The sounding furrow");
	});
});

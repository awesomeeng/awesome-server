// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const Request = require("request-promise-native").defaults({
	rejectUnauthorized: false // for http2 we need to ignore our self-signed cert.
});

const AwesomeUtils = require("AwesomeUtils");
// require("AwesomeLog").init().start();

const AwesomeServer = require("../src/AwesomeServer");
const AbstractServer = require("../src/AbstractServer");
const AbstractRequest = require("../src/AbstractRequest");
const AbstractResponse = require("../src/AbstractResponse");
const HTTP2Server = require("../src/http2/HTTP2Server");
const HTTP2Request = require("../src/http2/HTTP2Request");
const HTTP2Response = require("../src/http2/HTTP2Response");

describe("HTTP2Server",function(){
	let server,port,url;

	beforeEach(async function(){
		server = new AwesomeServer();
		port = await AwesomeUtils.Net.randomPort();
		url = "https://127.0.0.1:"+port;

		server.addHTTP2Server({
			host: "127.0.0.1",
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
		assert(server.servers[0] instanceof HTTP2Server);
		assert(server.servers[0].running);
		assert(AwesomeUtils.Net.portInUse(port));
	});

	it("Request",async function(){
		let req;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});
		await Request.get({
			uri: url+"/test",
			// rejectUnauthorized: false
		});

		assert(req);
		assert(req instanceof AbstractRequest);
		assert(req instanceof HTTP2Request);
	});

	it("Response",async function(){
		let resp;
		server.route("*","/test",async (path,request,response)=>{
			resp = response;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});

		await Request.get(url+"/test");

		assert(resp);
		assert(resp instanceof AbstractResponse);
		assert(resp instanceof HTTP2Response);
	});

	it("get request",async function(){
		let req,resp;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			resp = response;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});

		let response = await Request.get(url+"/test");

		assert(req);
		assert.equal(req.method,"GET");
		assert.equal(req.url.href,"/test");
		assert.equal(req.path,"/test");

		assert(resp);
		assert.equal(resp.finished,true);
		assert.equal(resp.statusCode,200);
		assert.equal(resp.contentType,"text/plain");
		assert.equal(resp.contentEncoding,"utf-8");

		assert.equal(response,"the quick brown fox jumped over the lazy dog.");
	});

	it("post request",async function(){
		let req,resp;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			resp = response;
			let body = await request.readText();
			await response.writeText(body);
		});

		let response = await Request.post({
			url: url+"/test",
			headers: {
				"content-type": "text/plain"
			},
			body: "Come, my friends, / 'Tis not too late to seek a newer world. / Push off, and sitting well in order smite / The sounding furrow"
		});

		assert(req);
		assert.equal(req.method,"POST");
		assert.equal(req.url.href,"/test");
		assert.equal(req.path,"/test");

		assert(resp);
		assert.equal(resp.finished,true);
		assert.equal(resp.statusCode,200);
		assert.equal(resp.contentType,"text/plain");
		assert.equal(resp.contentEncoding,"utf-8");

		assert.equal(response,"Come, my friends, / 'Tis not too late to seek a newer world. / Push off, and sitting well in order smite / The sounding furrow");
	});
});

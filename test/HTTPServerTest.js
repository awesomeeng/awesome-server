// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const Request = require("request-promise-native");

const AwesomeUtils = require("AwesomeUtils");
// require("AwesomeLog").init().start();

const AwesomeServer = require("../src/AwesomeServer");
const AbstractServer = require("../src/AbstractServer");
const AbstractRequest = require("../src/AbstractRequest");
const AbstractResponse = require("../src/AbstractResponse");
const HTTPServer = require("../src/http/HTTPServer");
const HTTPRequest = require("../src/http/HTTPRequest");
const HTTPResponse = require("../src/http/HTTPResponse");

describe("HTTPServer",function(){
	let server,port,url;

	beforeEach(async function(){
		server = new AwesomeServer();
		port = await AwesomeUtils.Net.randomPort();
		url = "http://127.0.0.1:"+port;

		server.addHTTPServer({
			host: "127.0.0.1",
			port
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
		assert(server.servers[0] instanceof HTTPServer);
		assert(server.servers[0].running);
		assert(AwesomeUtils.Net.portInUse(port));
	});

	it("Request",async function(){
		let req;
		server.route("*","/test",async (path,request,response)=>{
			req = request;
			await response.writeText("the quick brown fox jumped over the lazy dog.");
		});

		await Request.get(url+"/test");

		assert(req);
		assert(req instanceof AbstractRequest);
		assert(req instanceof HTTPRequest);
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
		assert(resp instanceof HTTPResponse);
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

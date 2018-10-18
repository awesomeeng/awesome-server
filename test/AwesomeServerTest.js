// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
const URL = require("url");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
// require("AwesomeLog").init().start();

const AwesomeServer = require("../src/AwesomeServer");
const AbstractController = require("../src/AbstractController");
const AbstractRequest = require("../src/AbstractRequest");
const AbstractResponse = require("../src/AbstractResponse");
const AbstractServer = require("../src/AbstractServer");

describe("AwesomeServer",function(){
	it("static",function(){
		assert.equal(AwesomeServer.AbstractController,AbstractController);
		assert.equal(AwesomeServer.AbstractRequest,AbstractRequest);
		assert.equal(AwesomeServer.AbstractResponse,AbstractResponse);
		assert.equal(AwesomeServer.AbstractServer,AbstractServer);
	});

	it("constructor",function(){
		let server = new AwesomeServer();

		assert(server);
		assert(server.servers);
		assert(!server.running);
		assert(server.start && server.start instanceof Function);
		assert(server.stop && server.stop instanceof Function);
		assert(server.addServer && server.addServer instanceof Function);
		assert(server.addHTTPServer && server.addHTTPServer instanceof Function);
		assert(server.addHTTPSServer && server.addHTTPSServer instanceof Function);
		assert(server.addHTTP2Server && server.addHTTP2Server instanceof Function);
		assert(server.removeServer && server.removeServer instanceof Function);
		assert(server.handler && server.handler instanceof Function);
		assert(server.route && server.route instanceof Function);
		assert(server.unroute && server.unroute instanceof Function);
		assert(server.redirect && server.redirect instanceof Function);
		assert(server.serve && server.serve instanceof Function);
		assert(server.push && server.push instanceof Function);
		assert(server.handler && server.handler instanceof Function);

		assert.deepStrictEqual(server.servers,[]);
		assert.deepStrictEqual(server.routes,[]);
	});

	it("handler",function(){
		let server = new AwesomeServer();

		let request = new (class Request extends AbstractRequest{
			get origin() {
				return "localhost:1234";
			}

			get method() {
				return "GET";
			}

			get url() {
				return URL.parse("http://localhost/index.html");
			}

			get path() {
				return this.url.path;
			}
		});

		let response = new (class Response extends AbstractResponse {
			get finished() {
				return true;
			}
		});

		server.handler(request,response);
	});

	it("start/stop",async function(){
		let server = new AwesomeServer();
		assert(server);
		assert(!server.running);

		await server.start();
		assert(server.running);

		await server.stop();
		assert(!server.running);
	});

	it("addHTTPServer",function(){
		let server = new AwesomeServer();

		assert.equal(server.servers.length,0);

		server.addHTTPServer({
			hostname: "localhost",
			port: 1234
		});

		assert.equal(server.servers.length,1);
	});

	it("addHTTPSServer",function(){
		let server = new AwesomeServer();

		assert.equal(server.servers.length,0);

		server.addHTTPSServer({
			hostname: "localhost",
			port: 1234
		});

		assert.equal(server.servers.length,1);
	});

	it("addHTTP2Server",function(){
		let server = new AwesomeServer();

		assert.equal(server.servers.length,0);

		server.addHTTP2Server({
			hostname: "localhost",
			port: 1234
		});

		assert.equal(server.servers.length,1);
	});

	it("removeServer",function(){
		let server = new AwesomeServer();

		assert.equal(server.servers.length,0);

		server.addHTTPServer({
			hostname: "localhost",
			port: 1234
		});
		server.addHTTPSServer({
			hostname: "localhost",
			port: 1234
		});
		server.addHTTP2Server({
			hostname: "localhost",
			port: 1234
		});

		assert.equal(server.servers.length,3);
		server.removeServer(server.servers[0]);
		assert.equal(server.servers.length,2);
		server.removeServer(server.servers[0]);
		assert.equal(server.servers.length,1);
		server.removeServer(server.servers[0]);
		assert.equal(server.servers.length,0);
	});

	it("Create Basic HTTP Server",async function(){
		let port = await AwesomeUtils.Net.randomPort();

		let server = new AwesomeServer();
		server.addHTTPServer({
			hostname: "localhost",
			port
		});

		assert(!await AwesomeUtils.Net.portInUse(port));
		await server.start();
		assert(await AwesomeUtils.Net.portInUse(port));
		await server.stop();
	});

	it("Create Basic HTTPS Server",async function(){
		let port = await AwesomeUtils.Net.randomPort();

		let server = new AwesomeServer();
		server.addHTTPSServer({
			hostname: "localhost",
			port
		});

		assert(!await AwesomeUtils.Net.portInUse(port));
		await server.start();
		assert(await AwesomeUtils.Net.portInUse(port));
		await server.stop();
	});

	it("Create Basic HTTP Server",async function(){
		let port = await AwesomeUtils.Net.randomPort();

		let server = new AwesomeServer();
		server.addHTTP2Server({
			hostname: "localhost",
			port
		});

		assert(!await AwesomeUtils.Net.portInUse(port));
		await server.start();
		assert(await AwesomeUtils.Net.portInUse(port));
		await server.stop();
	});
});

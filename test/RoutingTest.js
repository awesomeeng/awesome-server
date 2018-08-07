// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeServer = require("../src/AwesomeServer");
// require("AwesomeLog").init().start();

const AbstractController = require("../src/AbstractController");

describe("AwesomeServer.Routing",function(){
	it("route function",function(){
		let server = new AwesomeServer();
		server.route("get","/test",()=>{});
		assert(server.routes.indexOf("GET: /test")>-1);

		server.route("post","/test",()=>{});
		assert(server.routes.indexOf("POST: /test")>-1);

		server.route("put","/test",()=>{});
		assert(server.routes.indexOf("PUT: /test")>-1);

		server.route("delete","/test",()=>{});
		assert(server.routes.indexOf("DELETE: /test")>-1);

		server.route("head","/test",()=>{});
		assert(server.routes.indexOf("HEAD: /test")>-1);

		server.route("options","/test",()=>{});
		assert(server.routes.indexOf("OPTIONS: /test")>-1);

		server.route("patch","/test",()=>{});
		assert(server.routes.indexOf("PATCH: /test")>-1);

		server.route("connect","/test",()=>{});
		assert(server.routes.indexOf("CONNECT: /test")>-1);

		server.route("trace","/test",()=>{});
		assert(server.routes.indexOf("TRACE: /test")>-1);

		server.route("*","/test",()=>{});
		assert(server.routes.indexOf("*: /test")>-1);

		server.route("*",/\/test/,()=>{});
		assert(server.routes.indexOf("*: /\\/test/")>-1);
	});

	it("unroute function",function(){
		let server = new AwesomeServer();
		server.route("get","/test",()=>{});
		server.route("post","/test",()=>{});
		server.route("get","/test1",()=>{});
		server.route("get","/test/abc/xyz",()=>{});
		server.route("post","/monkey",()=>{});
		server.route("*",/asdf/g,()=>{});
		assert.equal(server.routes.length,6);

		server.unroute("get","/test");
		assert.equal(server.routes.length,5);

		server.unroute("delete","/test");
		assert.equal(server.routes.length,5);

		server.unroute("post","/monkey");
		assert.equal(server.routes.length,4);

		server.unroute("*","asdf");
		assert.equal(server.routes.length,4);

		server.unroute("*",/asdf/);
		assert.equal(server.routes.length,4);

		server.unroute("*",/asdf/g);
		assert.equal(server.routes.length,3);
	});

	it("route controller",function(){
		let server = new AwesomeServer();

		let controller = new (class Controller extends AbstractController {
		});

		server.route("*","/test",controller);
		assert.equal(server.routes.length,1);
	});

	it("unroute controller",function(){
		let server = new AwesomeServer();

		let controller = new (class Controller extends AbstractController {
		});

		server.route("*","/test1",controller);
		server.route("*","/test2",controller);
		server.route("*","/test3",controller);
		assert.equal(server.routes.length,3);
		server.unroute("*","/test",controller);
		assert.equal(server.routes.length,3);
		server.unroute("*","/test1",controller);
		assert.equal(server.routes.length,2);
		server.unroute("*","/test2",controller);
		assert.equal(server.routes.length,1);
	});

	it("route controller file",function(){
		let server = new AwesomeServer();

		server.route("*","/one","./controllers/one.js");
		server.route("*","/two","./controllers/two.js");
		server.route("*","/three","./controllers/three.js");
		server.route("*","/three/one","./controllers/three/one.js");

		assert.equal(server.routes.length,4);
	});

	it("unroute controller file",function(){
		let server = new AwesomeServer();

		server.route("*","/one","./controllers/one.js");
		server.route("*","/two","./controllers/two.js");
		server.route("*","/three","./controllers/three.js");
		server.route("*","/three/one","./controllers/three/one.js");

		assert.equal(server.routes.length,4);

		server.unroute("*","/one","./controllers/one.js");
		assert.equal(server.routes.length,3);

		server.unroute("*","/two","./controllers/two.js");
		assert.equal(server.routes.length,2);

		server.unroute("*","/three","./controllers/three.js");
		assert.equal(server.routes.length,1);
	});

	it("route controller directory",function(){
		let server = new AwesomeServer();

		server.route("*","/","./controllers");
		assert.equal(server.routes.length,5); // 1 for the directory itself, 1 for each controller.
	});

	it("unroute controller directory",function(){
		let server = new AwesomeServer();

		server.route("*","/","./controllers");
		assert.equal(server.routes.length,5); // 1 for the directory itself, 1 for each controller.

		server.unroute("*","/","./controllers");
		assert.equal(server.routes.length,0);
	});

	it("route redirect",function(){
		let server = new AwesomeServer();

		server.redirect("/blah1","/test1");
		server.redirect("/blah2","/test2",true);
		server.redirect("/blah3","/test3",false);

		assert.equal(server.routes.length,3);
	});

	it("unroute redirect",function(){
		let server = new AwesomeServer();

		server.redirect("/blah1","/test1");
		server.redirect("/blah2","/test2",true);
		server.redirect("/blah3","/test3",false);

		assert.equal(server.routes.length,3);

		server.unroute("*","/blah1");
		assert.equal(server.routes.length,2);

		server.unroute("*","/blah3");
		assert.equal(server.routes.length,1);
	});

	it("route serve file",function(){
		let server = new AwesomeServer();

		server.serve("/index.html","./files/index.html");
		server.serve("/hello.css","test/css","./files/hello.css");
		assert.equal(server.routes.length,2);
	});

	it("unroute serve file ",function(){
		let server = new AwesomeServer();

		server.serve("/index.html","./files/index.html");
		server.serve("/hello.css","test/css","./files/hello.css");
		assert.equal(server.routes.length,2);

		server.unroute("*","/hello.css");
		assert.equal(server.routes.length,1);

		server.unroute("*","/index.html");
		assert.equal(server.routes.length,0);
	});

	it("route serve directory",function(){
		let server = new AwesomeServer();

		server.serve("/test","./files");
		assert.equal(server.routes.length,3); // add serve directory maps /path and /path/ and /path/*
	});

	it("unroute serve directory",function(){
		let server = new AwesomeServer();

		server.serve("/test","./files");
		assert.equal(server.routes.length,3); // add serve directory maps /path and /path/ and /path/*

		server.unroute("*","/test");
		assert.equal(server.routes.length,0);
	});

	it("route push",function(){
		let server = new AwesomeServer();

		server.serve("/index.html","test/html","./files/index.html");
		server.push("/hello.css","/hello.css","test/css","./files/hello.css");
		assert.equal(server.routes.length,2);
	});

	it("unroute PushServe",function(){
		let server = new AwesomeServer();

		server.serve("/index.html","/index.html","./files/index.html");
		server.push("/hello.css","/hello.css","test/css","./files/hello.css");
		assert.equal(server.routes.length,2);

		server.unroute("*","/hello.css");
		assert.equal(server.routes.length,1);

		server.unroute("*","/index.html");
		assert.equal(server.routes.length,0);
	});
});

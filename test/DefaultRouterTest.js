// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
const URL = require("url");

const AwesomeUtils = require("AwesomeUtils");
// require("AwesomeLog").init().start();

const DefaultRouter = require("../src/routers/DefaultRouter");
const AbstractController = require("../src/AbstractController");

describe("DefaultRouter",function(){
	it("constructor",function(){
		let router = new DefaultRouter();
		assert(router);
		assert(router.prefix);
	});

	it("prefix",function(){
		let router = new DefaultRouter();
		assert.equal(router.prefix,"/");

		router.prefix = "/api";
		assert.equal(router.prefix,"/api");

		assert.throws(()=>{
			router.prefix = null;
		});

		router.prefix = undefined;
		assert.equal(router.prefix,"/");

		assert.throws(()=>{
			router.prefix = 123;
		});
	});

	it("fullPath",function(){
		let router = new DefaultRouter();
		assert.equal(router.fullPath("/test"),"/test");
		assert.equal(router.fullPath("/test/abc/x/y/z/123.html?q=123456"),"/test/abc/x/y/z/123.html?q=123456");

		router.prefix = "/this_is_a_test/";
		assert.equal(router.fullPath("/test"),"/this_is_a_test/test");
		assert.equal(router.fullPath("/test/abc/x/y/z/123.html?q=123456"),"/this_is_a_test/test/abc/x/y/z/123.html?q=123456");
	});

	it("add",function(){
		let router = new DefaultRouter();
		router.add("get","/test",()=>{});
		assert(router.routes.indexOf("GET: /test")>-1);

		router.add("post","/test",()=>{});
		assert(router.routes.indexOf("POST: /test")>-1);

		router.add("put","/test",()=>{});
		assert(router.routes.indexOf("PUT: /test")>-1);

		router.add("delete","/test",()=>{});
		assert(router.routes.indexOf("DELETE: /test")>-1);

		router.add("head","/test",()=>{});
		assert(router.routes.indexOf("HEAD: /test")>-1);

		router.add("options","/test",()=>{});
		assert(router.routes.indexOf("OPTIONS: /test")>-1);

		router.add("patch","/test",()=>{});
		assert(router.routes.indexOf("PATCH: /test")>-1);

		router.add("connect","/test",()=>{});
		assert(router.routes.indexOf("CONNECT: /test")>-1);

		router.add("trace","/test",()=>{});
		assert(router.routes.indexOf("TRACE: /test")>-1);

		router.add("*","/test",()=>{});
		assert(router.routes.indexOf("*: /test")>-1);

		router.add("*",/\/test/,()=>{});
		assert(router.routes.indexOf("*: /\\/test/")>-1);
	});

	it("remove",function(){
		let router = new DefaultRouter();
		router.add("get","/test",()=>{});
		router.add("post","/test",()=>{});
		router.add("get","/test1",()=>{});
		router.add("get","/test/abc/xyz",()=>{});
		router.add("post","/monkey",()=>{});
		assert.equal(router.routes.length,5);

		router.remove("get","/test");
		assert.equal(router.routes.length,4);

		router.remove("delete","/test");
		assert.equal(router.routes.length,4);

		router.remove("post","/monkey");
		assert.equal(router.routes.length,3);

		router.add("*",/asdf/g,()=>{});
		assert.equal(router.routes.length,4);

		router.remove("*","asdf");
		assert.equal(router.routes.length,4);

		router.remove("*",/asdf/);
		assert.equal(router.routes.length,4);

		router.remove("*",/asdf/g);
		assert.equal(router.routes.length,3);
	});

	it("addController",function(){
		let router = new DefaultRouter();

		let controller = new (class Controller extends AbstractController {
		});

		router.addController("/test",controller);
		assert.equal(router.routes.length,1);

		assert.throws(()=>{
			router.add("/test",controller);
		});
	});

	it("removeController",function(){
		let router = new DefaultRouter();

		let controller = new (class Controller extends AbstractController {
		});

		router.addController("/test1",controller);
		router.addController("/test2",controller);
		router.addController("/test3",controller);
		assert.equal(router.routes.length,3);
		router.removeController("/test");
		assert.equal(router.routes.length,3);
		router.removeController("/test1");
		assert.equal(router.routes.length,2);
		router.removeController("/test2",controller);
		assert.equal(router.routes.length,1);

		router.remove("*","/test3"); // this should work to remove the controller.
		assert.equal(router.routes.length,0);
	});

	it("addControllerFile",function(){
		let router = new DefaultRouter();

		router.addControllerFile("/one",AwesomeServer.resolveRelativeToModule(module,"./controllers/one.js"));
		router.addControllerFile("/two",AwesomeServer.resolveRelativeToModule(module,"./controllers/two.js"));
		router.addControllerFile("/three",AwesomeServer.resolveRelativeToModule(module,"./controllers/three.js"));
		router.addControllerFile("/three/one",AwesomeServer.resolveRelativeToModule(module,"./controllers/three/one.js"));

		assert.equal(router.routes.length,4);
	});

	it("removeControllerFile",function(){
		let router = new DefaultRouter();

		router.addControllerFile("/one",AwesomeServer.resolveRelativeToModule(module,"./controllers/one.js"));
		router.addControllerFile("/two",AwesomeServer.resolveRelativeToModule(module,"./controllers/two.js"));
		router.addControllerFile("/three",AwesomeServer.resolveRelativeToModule(module,"./controllers/three.js"));
		router.addControllerFile("/three/one",AwesomeServer.resolveRelativeToModule(module,"./controllers/three/one.js"));

		assert.equal(router.routes.length,4);

		router.removeControllerFile("/one",AwesomeServer.resolveRelativeToModule(module,"./controllers/one.js"));
		assert.equal(router.routes.length,3);

		router.removeControllerFile("/two",AwesomeServer.resolveRelativeToModule(module,"./controllers/two.js"));
		assert.equal(router.routes.length,2);

		router.removeControllerFile("/three",AwesomeServer.resolveRelativeToModule(module,"./controllers/three.js"));
		assert.equal(router.routes.length,1);
	});

	it("addControllerDirectory",function(){
		let router = new DefaultRouter();

		router.addControllerDirectory(AwesomeServer.resolveRelativeToModule(module,"./controllers"));
		assert.equal(router.routes.length,4);
	});

	it("removeControllerDirectory",function(){
		let router = new DefaultRouter();

		router.addControllerDirectory(AwesomeServer.resolveRelativeToModule(module,"./controllers"));
		assert.equal(router.routes.length,4);

		router.removeControllerDirectory(AwesomeServer.resolveRelativeToModule(module,"./controllers"));
		assert.equal(router.routes.length,0);
	});

	it("addServe",function(){
		let router = new DefaultRouter();

		router.addServe("/index.html",AwesomeServer.resolveRelativeToModule(module,"./files/index.html"));
		router.addServe("/index.css","test/css",AwesomeServer.resolveRelativeToModule(module,"./files/index.css"));
		assert.equal(router.routes.length,2);
	});

	it("removeServe",function(){
		let router = new DefaultRouter();

		router.addServe("/index.html",AwesomeServer.resolveRelativeToModule(module,"./files/index.html"));
		router.addServe("/index.css","test/css",AwesomeServer.resolveRelativeToModule(module,"./files/index.css"));
		assert.equal(router.routes.length,2);

		router.removeServe("/index.css");
		assert.equal(router.routes.length,1);

		router.remove("/index.html");
		assert.equal(router.routes.length,0);
	});

	it("addServeDirectory",function(){
		let router = new DefaultRouter();

		router.addServeDirectory("/test",AwesomeServer.resolveRelativeToModule(module,"./files"));
		assert.equal(router.routes.length,3); // add serve directory maps /path and /path/ and /path/*
	});

	it("removeServeDirectory",function(){
		let router = new DefaultRouter();

		router.addServeDirectory("/test",AwesomeServer.resolveRelativeToModule(module,"./files"));
		assert.equal(router.routes.length,3); // add serve directory maps /path and /path/ and /path/*

		router.removeServeDirectory("/test",AwesomeServer.resolveRelativeToModule(module,"./files"));
		assert.equal(router.routes.length,0);
	});

	it("addPushServe",function(){
		let router = new DefaultRouter();

		router.addPushServe("/index.html","/index.html",AwesomeServer.resolveRelativeToModule(module,"./files/index.html"));
		router.addPushServe("/index.css","/index.css","test/css",AwesomeServer.resolveRelativeToModule(module,"./files/index.css"));
		assert.equal(router.routes.length,2);
	});

	it("removePushServe",function(){
		let router = new DefaultRouter();

		router.addPushServe("/index.html","/index.html",AwesomeServer.resolveRelativeToModule(module,"./files/index.html"));
		router.addPushServe("/index.css","/index.css","test/css",AwesomeServer.resolveRelativeToModule(module,"./files/index.css"));
		assert.equal(router.routes.length,2);

		router.removePushServe("/index.css");
		assert.equal(router.routes.length,1);

		router.remove("/index.html");
		assert.equal(router.routes.length,0);
	});

	it("addRedirect",function(){
		let router = new DefaultRouter();

		router.addRedirect("/blah1","/test1");
		router.addRedirect("/blah2","/test2",true);
		router.addRedirect("/blah3","/test3",false);

		assert.equal(router.routes.length,3);
	});

	it("removeRedirect",function(){
		let router = new DefaultRouter();

		router.addRedirect("/blah1","/test1");
		router.addRedirect("/blah2","/test2",true);
		router.addRedirect("/blah3","/test3",false);

		assert.equal(router.routes.length,3);

		router.removeRedirect("/blah1");
		assert.equal(router.routes.length,2);

		router.removeRedirect("/blah3");
		assert.equal(router.routes.length,1);
	});

});

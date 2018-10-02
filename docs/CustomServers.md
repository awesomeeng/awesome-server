# [AwesomeServer](../README.md) > Custom Servers

This document details how to write a custom server, if that is something you need to do.  In most cases, the built in HTTP, HTTPS, and HTTP2 servers should suffice.

## Contents
 - [Using a Custom Server](#using-a-custom-server)
 - [How to Write a Custom Server](#how-to-write-a-custom-server)
 - [Handling Requests](#handling-requests)

## Using a Custom Server

We will talk about how to write a custom server in a second, but wanted to show you how to use a custom server first.

Using a custom server is done in three easy steps:

 1. Require AwesomeServer and the custom server... You could also require a third party custom server in a similar manner.
	```
	const AwesomeServer = require("@awesomeeng/awesome-server");
	const MyCustomServer = require("./MyCustomServer");
	```

 2. Instantiate the custom server:
	```
	const customServer = new MyCustomServer({
		... some config options if needed ...
	});
	```

 3. Instantiate AwesomeServer, add the custom server, and start.
	```
	const server = new AwesomeServer();
	server.addServer(customServer);
	server.start();
	```

## How to Write a Custom Server

In order to write a custom server to work with AwesomeServer you will need to extend three separate classes: `AwesomeServer.AbstractServer`, `AwesomeServer.AbstractRequest`, and `AwesomeServer.AbstractResponse`.

#### AbstractServer

You must extend and implement a `AwesomeServer.AbstractServer` subclass which defines things important to all servers.  Here's a brief example:

```
const AwesomeServer = require("@awesomeeng/awesome-server");
const AbstractServer = AwesomeServer.AbstractServer;

const MyCustomRequest = require("./MyCustomRequest");
const MyCustomResponse = require("./MyCustomResponse");

const $ORIGINAL = Symbol("original");

class MyCustomServer extends AbstractServer {
	constructor(config) {
		super(config);

		this[$ORIGINAL] = null;
	}

	get running() {
		return !!this[$ORIGINAL];
	}

	get original() {
		return this[$ORIGINAL];
	}

	start(handler) {
		if (this.running) return Promise.resolve();

		return new Promise((resolve,reject)=>{
			this[$ORIGINAL] = new someUnderlyingServerClass();
			this[$ORIGINAL].on("request",this.handler.bind(this,handler));
			this[$ORIGINAL].start();
		});
	}

	stop() {
		if (!this.running) return Promise.resolve();
		return new Promise((resolve,reject)=>{
			this[$ORIGINAL].stop();
			this[$ORIGINAL] = null;
		});
	}

	handler(handler,request,response) {
		request = new MyCustomRequest(request,response);
		response = new MyCustomResponse(request,response);
		handler(request,response);
	}
}
```

The following members and methods must be overloaded by your class:

> **constructor(config)** Returns a new instance of your Server.  Must pass *config* to the super class.
- **config**: [Object] A configuration object for your server.

> **running**: [boolean] Returns true if the underlying server is running.

> **original**: [*] Returns the underlying server.

> **start(handler)** Executed when AwesomeServer is started. This receives the handler function must call for each incoming request you want to process. It is on you to call it. Returns a Promise that resolves when the underlying server is started.
- **handler**: [Function] The AwesomeServer handler function to be called for each request.
- returns **Promise > void**

> **stop()** Executed when AwesomeServer is stopped. Returns a Promise that resolves when the underlying server is stopped.
- returns **Promise > void**

## Handling Requests

When a server is started via `server.start()` it receives a handler function to call with each incoming request you want to process via AwesomeServer.  It is up to you when and how to call this.  Our recommended practice is shown in the example above. There, every time a `request` event is fired, it calls the `this.handler()` function of our MyCustomServer class instance.  It gets the bound `handler` function as well as the new request and response object.  In the MyCustomServer `handler` function, we wrap the request and response objects, and then hand everything off to the AwesomeServer handler function for processing.

AwesomeServer requires that the request object it recieves in its `handler` function is an instances of `AbstractRequest`. The best approach to doing this is to provide a custom subclass of `AbstractRequest` for your custom server.

AwesomeServer requires that the response object it recieves in its `handler` function is an instances of `AbstractResponse`. The best approach to doing this is to provide a custom subclass of `AbstractResponse` for your custom server.

## Custom AbstractRequest Implementation

You implement `AbstractRequest` by extending it, shown here:

```
const AwesomeServer = require("@awesomeeng/awesome-server");
const AbstractRequest = AwesomeServer.AbstractRequest;

class MyCustomRequest extends AbstractRequest {
	...
}
```

Each implementation of `AbstractRequest` must overload the following functions:

> **request.original**: [IncomingMessage|Http2ServerRequest] - Returns the underlying request object.

> **request.method**: [string] - Returns the HTTP Method string, all uppercased.

> **request.url**: [URL] - Returns the request URL as a nodejs URL Object

> **request.path**: [string] - Returns the path portion of the request URL. Note that this is the actual entire path for the URL as opposed to the *path* argument your receive in your route functions which may have been reduced.

> **request.query**: [Object] - The parsed querystring object.

> **request.querystring**: [string] - The unparsed querystring string.

> **request.headers**: [Object] - Returns the request headers object.

> **request.contentType**: [string] - Returns the mime-type portion of the `Content-Type` header, if any.

> **request.contentEncoding**: [string] - Returns the encoding portion of the `Content-Type` header, if any.

> **request.useragent**: [string] - Returns the `User-Agent` header, if any.

> **read()** - Returns a Promise that resolves when the entire content is read from the request.
 - returns **Promise > Buffer **

## Custom AbstractResponse Implementation

You implement `AbstractResponse` by extending it, shown here:

```
const AwesomeServer = require("@awesomeeng/awesome-server");
const AbstractResponse = AwesomeServer.AbstractResponse;

class MyCustomResponse extends AbstractResponse {
	...
}
```

Each implementation of `AbstractResponse` must overload the following functions:

> **response.original**: [ServerResponse|Http2ServerResponse] - Returns the underlying response object.

> **response.statusCode**: [number] - Returns the status code for this response, if set via `response.writeHead()`.  Returns null if the statusCode has not been set yet.

> **response.finished**: [boolean] - Returns true if the underlying object has been closed via `response.end()`. This signals that no more content can be written to the response.  This will also signal AwesomeServer to stop processing routes in multiple routing situations.

> **response.pushSupported**: [boolean] - Returns true if the underlying server support push behaviors (ala HTTP/2). Both HTTP and HTTPS return false.

> **request.contentType**: [string] - Returns the mime-type portion of the `Content-Type` header, if any has been set yet.

> **request.contentEncoding**: [string] - Returns the encoding portion of the `Content-Type` header, if any has been set yet.

> **writeHead(statusCode)**<br/>
> **writeHead(statusCode,headers)**<br/>
> **writeHead(statusCode,statusMessage,headers)**<br/>
> Used to set the status code, status message (very optional), and the headers.  The statusCode argument is the only required argument.
 - **statusCode**: [number] The HTTP Status Code to send for this response.
 - **statusMessage**: [string] A status message to send for this response. Very optional.
 - **headers**: [null|Object] An object of headers, if any, to send for this response.
 - returns **Promise > void **

> **write(chunk,encoding="utf-8")** - Write a chunk of data to the response. You can call this multiple times, so long as you dont call `response.end()`.
 - **chunk**: [*] The data to be written.
 - **encoding**: [string] The content encoding to be used for string content.
 - returns **Promise > void**

> **end(chunk,encoding="utf-8")** - Called to signal the end of writing and flag the response as finished. If *data* is included, this calls `response.write(data,encoding)` first, then ends.
 - **chunk**: [*] The data to be written.
 - **encoding**: [string] The content encoding to be used for string content.
 - returns **Promise > void**

> **pipeFrom(readable)** - Pipes the contents from the given readable stream into the response. This is kind of backward from how streams normally work, but due to the structure of AwesoneServer, that's how its got to be.
 - **readable**: [Readable] A readable stream.
 - returns **Promise > void**

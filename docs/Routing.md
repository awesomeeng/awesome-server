# [AwesomeServer](../README.md) > Routing

This document details how routing works, how route ordering is important, and how to do multiple routes for a single request.

## Contents
 - [How Routing Works](#how-routing-works)
 - [Method and Path Matching](#method-and-path-matching)
 - [Simple Routing](#simple-routing)
 - [Routing Order and Multiple Routing](#routing-order-and-multiple-routing)
 - [Special Routing Situations](#special-routing-situations)

## How Routing Works

A route describes some function or controller that is called when an incoming request is received by AwesomeServer.  Routes are matched based on the HTTP Method and the request URL path portion. Each incoming request may match zero or more routes.

Every time a new request is received by AwesomeServer it goes through the following steps...

 1. **Wrap the Request Object** - The incoming request object is wrapped in an instance of  it appropriate parent request wrapper (like HTTPRequest, HTTPSRequest, or HTTP2Request) which is an instance of `AwesomeServer.AbstractRequest`.

 2. **Wrap the Response Object** - The incoming response object is wrapped in an instance of  it appropriate parent response wrapper (like HTTPResponse, HTTPSResponse, or HTTP2Response) which is an instance of `AwesomeServer.AbstractResponse`.

 3. **Log** - Log out the request details if Logging is enabled.

 4. **Match Routes** - Compute the list of all matching routes based on the incoming HTTP Method and the incoming URL path.

 5. **Execute Matching Routes** - Execute the matching route functions in the order they were added to AwesomeServer until the response is `finished` or there are no more routes. A response is considered `finished` when its underlying stream is closed.

 6. **End** - If the response is `finished`, the routing is complete.

 7. **Error** - If the response is not `finished`, respond with a 404 status code.

## Method and Path Matching

When a route is added you specify both a *method* and a *path matcher* argument.

The *method* is one of the HTTP Methods supported by AwesomeServer, namely GET, POST, PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH. You may also specify a wildcard "*" character to match any HTTP Method.

The *path matcher* is a string expression, regular expression, or a Path Matcher class instance that describes how to match the incoming URL path against the route.  Path Matching is its own subject, so make sure to read the [Path Matching documentation](./Advanced_Paths.md).

A route is considered a match if both the *method* and *path* of the incoming request are matches.

## Simple Routing

Simple routing where the developer provides the *method* and *path* to match and the handler or controller to execute. In most cases this will suffice.

```
const AwesomeServer = require("@awesomeeng/awesome-server");
const server = new AwesomeServer();

server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});

server.route("GET","/hello",async (path,request,response)=>{
	await response.writeText("Hello.");
});
server.route("GET","/world",async (path,request,response)=>{
	await response.writeText("World.");
});
server.start();
```

The above example will respond to `GET /hello` and `GET /world`.

## Routing Order and Multiple Routing

Because it is possible for multiple routes to match a single request, ordering of your routes is important.  AwesomeServer will execute the routes in the order they are added (via `server.route()`).

Consider this example which demonstrates both ordering and multiple matching routes.

```
const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
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
```

If the incoming request is `GET /helloworld` the routes would execute in the order `one > two > three > four`.

If the incoming request is `GET /hello` the routes would execute in the order `one > two > four`.

It is important to note that many of the shortcut methods provided for sending back responses such as `response.writeText()`, `response.writeHTML()`, `response.writeCSS()`, or `response.writeJSON()`, all close the response stream after writing and should be used with multiple routes carefully. In the example above, note that we use the basic `response.writeHead()`, `response.write()` and `response.end()` instead.

## Special Routing Situations

AwesomeServer has some special routing systems over and above the basic `server.route()` provided for ease of use. These are described below:

#### Redirect

AwesomeServer provides a standard Redirect router for your convenience.  It can be used to respond with temporary or permanent redirections.  It has the following form:

> **server.redirect(method,path,toPath,temporary=false)**
 - **method**: [string] The method to match, or "*".
 - **path**: [string|RegExp|PathMatcher] The path matcher to match against.
 - **toPath**: [string] The new url or url path to redirect to.
 - **temporary**: [boolean] True if this is a temporary 302 redirect or a false if a permanent 301 one. Defaults to false.
 - returns **void**

#### Serve

An often use case in Server development is to respond to some incoming request by serving back a file.  AwesomeServer eases that by allowing you to directly route to a serve behavior for a given file or directory of files.

**It is important to note here that AwesomeServer is not intended to be a full blown web server and serving millions of files; consider using Apcahe HTTP or nginx for those sorts of things.**

Here is the form for the `server.serve()` method:

> **server.serve(path,filename)**<br/>
> **server.serve(path,contentType,filename)**<br/>
> **server.serve(path,directory)**<br/>

It is worth pointing out that `server.serve()` does not take a *method* to match against.  `server.serve()` only works for GET requests.

Also, one will note that `server.serve()` has three different signature, but they all roughly work the same...
> - **path**: [string|RegExp|PathMatcher] The path matcher to match against.
- **contentType**: [string] If provided serve the given filename as the given content type.  If not given AwesomeServer will attempt to guess the content type from the filename extension.  This option has no meaning in the directory version of this routing.
- **filename**: [string] The filename to serve.
- **directory**: [string] The directory to serve.
- returns **void**

If the directory form of `server.serve()` is used, that is if the filename maps to an existing directory, the contents of the directory are served for any path that matches a file in that directory.  This is a recursive operation, so nested directory contents are also served. For example, if you serve thus:

```
server.serve("/something","/my/awesome/server/files");
```

Then `/something/index.html` and `/something/styles/index.css` would both match if those files exists as `/my/awesome/server/files/index.html` and `/my/awesome/server/files/styles/index.css`.

#### Push

For HTTP/2 servers, an additional option for routing is the `server.push()` method.  This is similar to `server.serve()` in that it will serve a given file, but it will push its contents as part of an HTTP/2 response stream.  It is only available for HTTP/2 server requests.

It has the following form:

> **server.push(path,referencePath,contentType,filename)**
 - **path**: [string|RegExp|PathMatcher] The path matcher to match against.
 - **referencePath**: [string] The path to push this filename as; that is how is this filename to be referenced.
 - **contentType**: [string] The content type to serve this file as. Optional. If not given AwesomeServer will attempt to guess the contentType from the filename extension.
 - **filename**: [string] The filename to push.
 - returns **void**

Here is an example...

```
const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTP2Server({
	host: "localhost",
	port: 7443,
	cert: server.resolve("./certificate.pub"),
	key: server.resolve("./certificate.key")
});
server.start();

/*
	Serve specific files with http/2 pushing and fallback
 */

// Fallback and serve the CSS straight up if the http2 stuff doesnt work for some reason.
server.serve("/hello/hello.css",server.resolve("./files/hello.css"));

// Push our CSS to any page that matches /hello or /hello/*
server.push("/hello/*","/hello/hello.css",server.resolve("./files/hello.css"));
server.push("/hello","/hello/hello.css",server.resolve("./files/hello.css"));

// Serve our basic html page at /hello. Because of the prior push rules, this will also include the pushed css file.
server.serve("/hello",server.resolve("./files/index.html"));
server.serve("/hello/index.html",server.resolve("./files/index.html"));
```

In this example, when a request comes in for `/hello` or `/hello/index.html` we serve those files.  At the same time, we also push `hello.css` because we know the browser will request it next.  This push allows the browser to get `hello.css` from its cache instead of asking the server for it.

# AwesomeServer

AwesomeServer is a customizable API Server framework for Enterprise Ready nodejs applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to provide flexible routing and controllers for responding to incoming requests in a consistent, repeatable, performant fashion.

## Features

AwesomeServer provides...
 - Easy to use.
 - HTTP support.
 - HTTPS support.
 - HTTP/2 support including push routing for preloading.
 - Or mix and match all three types of servers.
 - Basic routing to channel HTTP Method X along path Y into predefined functions.
 - Advanced routing using Controllers that takes your routing to the next level.
 - Controllers from Classes, Files, or whole Directory trees.
 - Support for serving static files (or whole directories) to specific routes.
 - Easy built-in redirects.
 - Built around native promises and ready for async/await.
 - Integrated with [AwesomeLog](https://github.com/awesomeeng/AwesomeLog) for easy logging if you want it.
 - Extensible with custom Servers.

## Why another API Server solution?

AwesomeServer is similar to Express, or Fastly, Hapi, etc. and those are all good products.  AwesomeServer just provides a different apporach to API Server code; one we think is cleaner and more understandable. If you want to use Express/Fastly/Hapi/whatever, that's perfectly fine by us. But if you want to try something a little cleaner, with less clutter, consider AwesomeServer.

## Contents
 - [Installation](#installation)
 - [Setup](#setup)
 - [Servers](#servers)
 - [Routing](#routing)
 - [Paths](#paths)
 - [Controllers](#controllers)
 - [Documentation](#documentation)
 - [Examples](#examples)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)

## Installation

Couldn't be easier.
```
npm install --save @awesomeeng/awesome-server
```

## Setup

AwesomeServer is structured to allow you to create your servers, define your routes, and go.

Setup has five steps:

1). Require AwesomeServer...

```
const AwesomeServer = require("@awesomeeng/awesome-server");
```

2). Instantiate AwesomeServer...
```
let server = new AwesomeServer();
```

3). Add Servers...
```
server.addHTTPServer({
	host: "localhost",
	port: 7080
});
```

4). Add Routes...
```
server.route("GET","/test",(path,request,response)=>{
	return response.writeHTML("Hello world!");
});
```

5). Go!
```
server.start();
```

## Servers

To use AwesomeServer you first have to add one (or more) servers to receive incoming requests.
You can choose from HTTP, HTTPS or HTTP/2 servers, by default, or add your own custom server entirely.

#### HTTP Server

You create a HTTP Server instance with the `addHTTPServer(config)` method, as shown here:

```
let server = new AwesomeServer();
server.addHTTPServer({
	host: "localhost",
	port: 7080
});
```

HTTP Server functionally wraps the nodejs http module.

For more information on using HTTP Server with AwesomeServer, read [the HTTP documentation](./docs/Advanced_HTTP.md).

#### HTTPS Server

You create a HTTPS Server instance with the `addHTTPSServer(config)` method, as shown here:

```
let server = new AwesomeServer();
server.addHTTPSServer({
	host: "localhost",
	port: 7080,
	cert: "./publickey.pem",
	key: "./privatekey.pem"
});
```

HTTPS Server functionally wraps the nodejs https module.

For more information on using HTTPS Server with AwesomeServer, read [the HTTPS documentation](./docs/Advanced_HTTPS.md).

#### HTTP/2 Server

You create a HTTP/2 Server instance with the `addHTTP2Server(config)` method, as shown here:

```
let server = new AwesomeServer();
server.addHTTP2Server({
	host: "localhost",
	port: 7080,
	cert: "./publickey.pem",
	key: "./privatekey.pem"
});
```

HTTP/2 Server functionally wraps the nodejs https module.

For more information on using HTTP/2 Server with AwesomeServer, read [the HTTP/2 documentation](./docs/Advanced_HTTP2.md).

## Routing

Routing is the process of taking incoming requests from the servers and sending them to various handling functions or [Controllers](#controllers) based on their method and path. Routing is primarily done by calling the `server.route(method,path,handler)` function, shown below...

```
server.route("GET","/test",someGetHandler);
server.route("POST","/test",somePostHandler);
server.route("*","*",catchAllHandler);
```

Each call to route take three arguments:

> **method**: Is a valid HTTP Method or the wildcard "*" character.

> **path**: Describes how to match against the path portion of the incoming request.  There are different types of way to match the path and you can read all about the options in the [Paths](#paths) section below.

> **handler**: May be one of several different things used to describe how to handle the incoming request that has matched the method and path conditions. The handler is only called if the method and path are matches.  A handler must return a Promise.

See our detailed [Routing documentation](./docs/Advanced_Routing.md) for a lot more details.

#### Handler Types

Handlers can be one of several different means of describing how to handle a request:

> **function**: The most basic form of handling a route, a function passed in as a handler will be
	executed when the route matches.  The function is executed with the signature
	(path,request,response).

> **controller**: You can pass a controller or controller class in as a handler.  The controller
	will then be executed when the route matches.  If a controller class is passed in, an instance of the controller is instantiated and used. Learn more about the awesomeness that is controllers here: [Controllers](#controllers).

> **filename**: If you pass a filename to a valid existing `.js` file that exports a Controller instance or Controller class, AwesomeServer will require the Controller file, create an instance of that controller, if needed, and then use that as the handler as described above. This enables working with Controllers in a much easier way.

> **directory**: If you pass a filename to a valid existing directory, AwesomeServer will recursively walk the directory mapping any valid `.js` file that exports a Controller instance or Controller class. The mapping is based on the route passed in, the location of the controller file relative to the root directory name provided, and the filename itself.  So if you had the following structure...
```
files/
  one.js
  two.js
  three.js
  three/
    four.js
```
> and routed `server.route("*","api","./files");` the resulting routes would be `/api/one`, `/api/two`, `/api/three`, and `/api/three/four`. One route for each matching `.js` file

## Paths

Most of the routing stuff above allows you to specify the *path* you want to match against.  The value of path may be one of following...

 - A **Exact** path string:
```
/path
```
 - A **Starts With** path string:
```
/path*
```
 - An **Ends With** path string:
```
*/path
```
 - A **Contains** path string:
```
*path*
```
 - An **Or Expression** path string:
```
/path|/path*|*/path
```
 -  a **Regular Expression**:
```
^/path/
```
 -  or a **custom implementation** of our AbstractPathMatcher class:
```
new AbstractPathMatcher() { ... }
```

To learn more about the details of Paths and Path Matching, check out our dedicated [Paths Documentation](./docs/Advanced_Paths.md).

## Controllers

A controller is a special type of routing that allows you to keep logical API behaviour together in a unified class.  Controllers respond to any HTTP method for a given path; so you can write a GET handler and a POST handler together in a single class focus around a given endpoint route. Controllers are roughly based on Grails and other frameworks, but with a little more JS magic.

A controller is always a Class (or instance of) that extends from `AwesomeServer.AbstractContoller`. AbstractController provides the handling of the incoming request and executing the appropriate method for the request based on the *HTTP method*.

In your subclass of AbstractController, you simply implement a method for one of the well used *HTTP Methods* (GET, POST, PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH).

```
class MyController extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller "+path);
	}

	async post(path,request,response) {
		await response.writeText("Controllers are awesome.");
	}
}
```

If the controller does not contain a corresponding method for the *HTTP Method* the controller will execute the `any()` function (see below).

You can read lots more about Controllers in our dedicated [Controller Documentation](./docs/Advanced_Controllers).

## Documentation

 - [HTTP Setup and Configuration](./docs/Advanced_HTTP.md)
 - [HTTPS Setup and Configuration](./docs/Advacned_HTTPS.md)
 - [HTTP/2 Setup and Configuration](./docs/Advanced_HTTP2.md)
 - [Route ordering and multiple handlers](./docs/Advanced_Routing.md)
 - [Advanced Paths](./docs/Advanced_Paths.md)
 - [Advanced Controllers](./docs/Advanced_Controllers.md)
 - [HTTP/2 Techniques](./docs/Advanced_HTTP2Techniques.md)
 - [Requests](./docs/Advanced_Requests.md)
 - [Responses](./docs/Advanced_Responses.md)
 - [Custom Servers](./docs/Advanced_CustomServers.md)

 - [API Documentation](./docs/API.md)

## Examples

AwesomeServer ships with a set of examples for your reference.

 - [BasicServer](./examples/BasicServer): An example of doing a basic HTTP server.

 - [HTTPSServer](./examples/HTTPSServer): An example of doing a basic HTTPS server including adding a public certificate and a private key.

 - [HTTP2Server](./examples/HTTP2Server): An example of doing a basic hTTP/2 server including how to push multiple responses for a single request.

 - [BasicController](./examples/BasicController): An example of implementing a basic controller and routing to it.

 - [ControllerClasses](./examples/ControllerClasses): An example of implementing multiple controllers and routing with Controller File Routing.

 - [ControllerDirectory](./examples/ControllerDirectory): An example of using Controller Directory Routing with multiple controllers and sub-directories.

 - [FileServer](./examples/FileServer): How to build a basic File Server using Server Directory Routing.

 - [HTTP2FileServer](./examples/HTTP2FileServer): An example of doing a slightly more complicated HTTP/2 server using Push Serve Routing and File Serve Routing fallback.

## The Awesome Engineering Company

AwesomeServer is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

AwesomeServer is released under the MIT License. Please read the  [LICENSE](https://raw.githubusercontent.com/awesomeeng/AwesomeServer/master/LICENSE?token=ABA2_wogpYds4a1qC_4aeUZd8C1in6Qcks5bUiQFwA%3D%3D) file for details.

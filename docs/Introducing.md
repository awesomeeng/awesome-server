# [AwesomeServer](../README.md) > Introducing AwesomeServer

AwesomeServer is a powerful HTTP/HTTPS/HTTP2 web framework for building enterprise node.js applications. AwesomeServer is focused on allowing developers to easily write endpoints and/or controllers instead of stringing together a collection of third party middleware libraries. It provides an easy but powerful routing structure, an opt-in controller based structure, consistent and helpful request and response objects, simple http/2 cache pushing, and integerated logging support.

Using AwesomeServer is super simple and fairly similar to other solutions, but also slightly different.  Getting started you simply instantiate AwesomeServer, add one or more servers, add one or more routes, and go.

In particular, AwesomeServer encourages you to write controllers, independant classes that handle a specific set of behaviours for a specific endpoint.  With a controller one says, for example, that the `/auth/session` route will be handled by the `AuthSessionController`.  You write the AuthSessionController in its own `.js` file and just route that file with AwesomeServer.  Then whenever a request comes in that matches the `/auth/session` route, AwesomeServer routes it to an instance of the controller class. Controllers allow developers to keep their API code separate and clean and not require a middleware solution or directory scanning be implemented.  All that is handled already for you with AwesomeServer.

## Key Features

 - **HTTP, HTTPS, or HTTP/2**: AwesomeServer serves HTTP or HTTPS or HTTP/2 endpoints. Choose one or mix and match in a single instance to serve multiple servers from a single framework. Or even add your own type of servers such as a socket.io or a quic server.

 - **HTTP/2 Push and Preloading**: In addition to merely responding to HTTP/2 request, AwesomeServer allows developers to do HTTP/2 pushes and preloading with minimal overhead.

 - **Classic Routing**: AwesomeServer allows you to do classic web framework routing such as handling HTTP Method X along path Y into predefined functions.

 - **Controllers**: Or you can use AwesomeServer's builtin controller structure and organize your code more efficiently. To make it even easier you can route to a specific controller or route an entire directory of controllers with a single command.

 - **Request Helpers**: Built in helpers for common request object needs like getting the User Agent or reading the body content.

 - **Response Helpers**: Built in helpers for common response object needs like setting headers, or responding with JSON/HTML/CSS/Text easily.

 - **Static Files**: Serve static files or whole directories easily with AwesomeServer's builtin commands.

 - **Redirects**: AwesomeServer makes adding redirects simple without the need to write a custom router.

 - **async/await**: AwesomeServer is written with Promises and async/await specifically in mind.

 - **No External Dependencies**: AwesomeConfig is written and maintained by The Awesome Engineering Company and has no dependency that was not written by us.  This means safer code and better support for you and your product.

 - **Free and Open**: AwesomeServer is released under the MIT License and completely free to use and modify.

## Getting Started

AwesomeServer is super easy to use.

#### 1). Install It.

```shell
npm install @awesomeeng/awesome-server
```

#### 2). Require It.

```javascript
let AwesomeServer = require("@awesomeeng/awesome-server");
```

#### 3). Instantiate It.

```javascript
let server = new AwesomeServer();
```

#### 4). Add One or more Servers.
```javascript
server.addHTTPServer({
	hostname: "localhost",
	port: 4000
});
```

You can add HTTP servers with `addHTTPServer()` or HTTPS servers with `addHTTPSServer()` or HTTP/2 servers with `addHTTP2Server()`. (Note that HTTPS and HTTP/2 servers require additional configuration details such as a `cert` and a `key` for the TLS security.)

AwesomeServer supports as many servers as you want to add for a single instance and they may or may not be the same type; meaning you can add three HTTP servers and one HTTPS server or whatever combination you want.

Also, AwesomeServer supports adding custom servers via the `addServer()` method.  There's a little bit more to it, so make sure to read the [Custom Servers](https://github.com/awesomeeng/awesome-server/blob/HEAD/docs/CustomServers.md) documentation.

#### 5). Add Routes

```javascript
server.route("GET","/test",(path,request,response)=>{
});

// or

server.route("/test","./MyTestController.js");
```

Route takes three arguments: `method`, `path`, and `handler`.

`method` is any valid HTTP METHOD (GET, POST, PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH). Method may also be `*` to match any HTTP method.

`path` is one of seven (7) possible path rules:

 - Exact: `/this/is/an/exact/path`

 - Starts With: `/this/is/a/starsWith/path/*`

 - Ends With: `*/this/is/an/endsWith/path`

 - Contains: `*/this/is/a/contains/path/*`

 - Or Expression: `/this/might/match|/or/this/might/match`

 - Regular Expression: `^/some\sregualr\sexpression/`

 - Custom Matcher: A class that extends `AbstractPathMatcher`.


`handler` is a function or a reference to a controller, that is executed when an incoming request matches the method and path of the route.

#### 6). Start It.
```javascript
server.start();
```

The `start()` method begins listening on each server and handling incoming request.

## Controllers

One place AwesomeServer distinguishes itself is in allowing developers to use controllers instead of just routing everything. A Controller is a class that is intended to handle all interaction methods for some given endpoint.

Say we have an endpoint at `/auth/session`. We can build a controller called `MyAuthSessionController` to handle GET, POST, and DELETE requests for that endpoint.

Each controller should be separated into its own file, like `MyAuthSessionController.js`. Within this file it defines and exports a class.  Controller classes must extend `AwesomeServer.AbstractController`. A Controller is then implemented by adding one or more HTTP method function like `get()` or `post()`. Finally, a controller is added to the routing of the servers with `server.route(path,controller)` where `controller` is the filename to the `MyAuthSessionController`.

Controllers are a great way to isolate and encapsualte behaviors into thier own structures instead of having a massive class full of `routing` and behaviors. In a controller, the endpoint is the noun (the subject) and the HTTP Method is the verv (the action) you want to perform on that endpoint.

There is a lot more to controllers, so we suggest interested parties check out the [Controller Documentation](https://github.com/awesomeeng/awesome-server/blob/HEAD/docs/Controllers.md).

## Documentation

That's the basics of AwesomeServer, but there is of course a lot more to it.

At this point, we suggest you check the [project readme](https://github.com/awesomeeng/awesome-server) out. Additionally there is specific documentation for Routing, Paths, Controllers, Requests, Responses, HTTP/2 Techniques, and Custom Servers.

 - [Read Me First!](https://github.com/awesomeeng/awesome-server)
 - [HTTP Setup and Configuration](https://github.com/awesomeeng/awesome-server/blob/master/docs/HTTP.md)
 - [HTTPS Setup and Configuration](https://github.com/awesomeeng/awesome-server/blob/master/docs/HTTPS.md)
 - [HTTP/2 Setup and Configuration](https://github.com/awesomeeng/awesome-server/blob/master/docs/HTTP2.md)
 - [Routing](https://github.com/awesomeeng/awesome-server/blob/master/docs/Routing.md)
 - [Paths](https://github.com/awesomeeng/awesome-server/blob/master/docs/Paths.md)
 - [Controllers](https://github.com/awesomeeng/awesome-server/blob/master/docs/Controllers.md)
 - [Requests](https://github.com/awesomeeng/awesome-server/blob/master/docs/Requests.md)
 - [Responses](https://github.com/awesomeeng/awesome-server/blob/master/docs/Responses.md)
 - [HTTP/2 Techniques](https://github.com/awesomeeng/awesome-server/blob/master/docs/HTTP2Techniques.md)
 - [Custom Servers](https://github.com/awesomeeng/awesome-server/blob/master/docs/CustomServers.md)

## AwesomeStack

AwesomeServer is one part of the free and open source set of libraries called AwesomeStack for rapidly building enterprise nodejs applications.  Each library is written to provide a stable, performant, part of your application stack that can be used on its own or as part of the greater AwesomeStack setup.

AwesomeStack includes...

 - **[AwesomeServer](https://github.com/awesomeeng/awesome-server)** - A HTTP/HTTPS/HTTP2 API Server focused on implementing API endpoints.

 - **[AwesomeLog](https://github.com/awesomeeng/awesome-log)** - Performant Logging for your application needs.

 - **[AwesomeConfig](https://github.com/awesomeeng/awesome-config)** - Powerful configuration for your application.

 - **[AwesomeCLI](https://github.com/awesomeeng/awesome-cli)** - Rapidly implement Command Line Interfaces (CLI) for your application.

All AwesomeStack libraries and AwesomeStack itself is completely free and open source (MIT license) and has zero external runtime dependencies. This means you can have confidence in your stack and not spend time worrying about licensing and code changing out from under you. Additionally, AwesomeStack and all of is components are maintained by The Awesome Engineering Company ensuring you a single point of contact and responsibility and unified support for your entire application.

You can learn more about AwesomeStack here: https://github.com/awesomeeng/awesome-stack

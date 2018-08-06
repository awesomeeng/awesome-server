# AwesomeServer

AwesomeServer is a customizable API Server framework for Enterprise Ready nodejs applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to provide flexible routing and controllers for responding to incoming requests in a consistent, repeatable fashion.

## Features

AwesomeServer provides...
 - An easy to use API Server framework.
 - HTTP support.
 - HTTPS support.
 - HTTP/2 support including push routes for preloading.
 - Or mix and match all three types of servers.
 - Basic routing to channel HTTP Method X along path Y into predefined functions.
 - Advanced routing using Controller that take your routing to the next level.
 - Controllers from Classes, Files, or whole Directory trees.
 - Support for serving static files (or whole directories) to specific routes.
 - Easy built-in redirects.
 - Built around native promises and ready for async/await.
 - Integrated with AwesomeLog for easy logging if you want it.
 - Extensible with custom Servers or Routers.

## Why Another API Server solution?

AwesomeServer is similar to Express, or Fastly, Hapi, etc. and those are all good products.  AwesomeServer just provides a different apporach to API Server code; one we think is cleaner and more understandable. If you want to use Express/Fastly/Hapi/whatever, that's perfectly fine by us. But if you want to try something a little cleaner, with less clutter, consider AwesomeServer.

## Contents
 - [Installation](#installation)
 - [Setup](#setup)
 - [Routing](#routing)
 - [Paths](#paths)
 - [Advanced Techniques](#advanced-techniques)
 - [Examples](#examples)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)

## Installation

Couldn't be easier.
```
npm install --save @awesomeeng/AwesomeServer
```

## Setup

AwesomeServer is structured to allow you to create your servers, define your routes, and go.

Setup has four steps:

1). Instantiate AwesomeServer...
```
let server = new AwesomeServer();
```

2). Add Servers...
```
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
```

3). Add Routes...
```
server.router.add("GET","/test",(path,request,response)=>{
	return response.writeHTML("Hello world!");
});
```

4). Go!
```
server.start();
```

## Routing

There are several approaches to defining routes out of the box with AwesomeServer:
 - You can define [routes as functions](#function-routing) (much like how you do it in express but without the nasty `next()` callbacks);
 - You can define a [Controller class](#controller-class-routing) for handling similar endpoints;
 - You can define a [Controller as a file](#controller-file-routing) which AwesomeServer will read and instantiate;
 - You can define a [directory of Controller files](#controller-directory-routing) which AwesomeServer will read, map to paths, and instantiate;
 - You can define a [specific file to serve](#serve-file-routing) for a specific route;
 - You can define a [directory to serve](#serve-directory-routing) any file that matches a related route;
 - You can define a [specific resource to push](#push-serve-routing) as part of an HTTP/2 connection.

### Function Routing

With Function Routing you define a specific function to execute when AwesomeServer receives a specific *HTTP Method* and a specific *path*.

```
server.router.add(method,path,handlerFunction)
```

The function called when the route is a match has the signature `f(path,request,response)`.

```
server.router.add("GET","/test",(path,request,response)=>{
 	... do something here ...
});
```

**You must return a promise from your function.**

### Controller Class Routing

With Controller Class routing you provide a specific controller that will be called for **any** *HTTP method* for a given *path*.  The controller is an instance of `AwesomeServer.AbstractController` and provides a means for handling each type of *HTTP method* you need to support.

```
server.router.addController(path,controller);
```

See the seciton below on [Controllers](#controllers) for more details on how they work.

```
server.router.addController("/test",myController);
```


### Controller File Routing

AwesomeServer tries to make your life a little easier, and thus Controller File Routing tries to take some of the burden of instantiating controllers off your plate.  You provide a *path* and a resolved filename to a valid class definition that implements `AwesomeServer.AbstractController`. If the file meets the following conditions, AwesomeServer will instantiate the Controller and then map it to the given *path* route.

 - Must be a valid nodejs javascript file;
 - Must compile and not contain any syntax errors;
 - Must export a Class that extends `AwesomeServer.AbstractController`.

```
server.router.addControllerFile(path,filename);
```

```
server.router.addControllerFile("/test","../controllers/MyController.js");
```

It is important to note that the **filename** must be resolvable to the actual file.  Relative filenames will be resolve relative to the current working directory `process.cwd()`.  If you want the file resolved to a specific location in your source code relative to the place where you are calling `server.router.addControllerFile()` you need to resolve it against the module filename. As a shortcut, AwesomeServer provides the `AwesomeServer.resolveRelativeToModule(module,filename)` function to ease use.

```
server.router.addControllerFile("/test",AwesomeServer.resolveRelativeToModule(module,"../controllers/MyController.js"));
```

### Controller Directory Routing

To ease development one step further, AwesomeServer provides Controller Directory Routing.  You supply the resolved path to a given directory, and AwesomeServer will map each JS file in that directory which matches the conditions outlined in Controller File Routing, to a path matching its name.  This is a recursive walk, so sub-directories get mapped using their sub-directory name and the filename, for expanded paths.

Consider the following tree:

```
controllers
  -- One.js
  -- Two.js
  -- Three
    -- Four.js
```

If we used the `addControllerDirectory(filename)` method...

```
server.addControllerDirectory("../controllers");
```

The following controllers would be mapped as shown...

 - /One - One.js
 - /Two - Two.js
 - /Three/Four - Three/Four.js

The resolved directory you pass to `addControllerDirectory()` must be resolved as described in Controller File Routing.

### Serve File Routing

For conveinence, AwesomeServer provides a means to route serving a specific file for a specific path.

```
server.router.addServe(path,contentType,filename);
```

Each time AwesomeServer gets a GET request that matches the path, the given filename will be served as the response.

If the *contentType* argument is null AwesomeServer will try and guess the content-type and use that value. In the event it cannot guess, it will use `application/octet-stream`.

```
server.addServe("/test","text/html","../files/test.html");
server.addServe("/test/test.css","text/css","../files/test.css");
server.addServe("/test/data",null,"../files/test.blah");
```

### Serve Directory Routing

Often you may need to serve more than one file via AwesomeServer, so we have provided an easy way to do that.

```
server.router.addServeDirectory(path,directory);
```

When AwesomeServer gets any GET request that matches the given *path* or starts with the given *path* it will attempt to find and serve the matching file in the given *directory*.  The `content-type` of the file will be guessed or `application/octet-stream`.

```
server.router.addServeDirectory("/test","../files");
```

A GET request that matches the path exactly will have `index.html` appended as needed.

Note that the directory specified must resolve as describe din Controller File Routing.

### Push Serve Routing

The last type of pre-built routing is Push Serve Routing. This allows you to specify certain files to be pushed for http2 requests that allow push responses.

```
server.router.addPushServe(path,contentType,filename);
```
This is similar to `server.router.addServe()` except the served content is pushed as part of a mutli-stream HTTP/2 response.

```
// Fallback and serve the CSS straight up if the http2 stuff doesnt work for some reason.
server.router.addServe("/test/test.css","./files/test.css");

// Push our CSS to any page that matches /test or /test/*
server.router.addPushServe("/test/*","/test/test.css","./files/test.css");
server.router.addPushServe("/test","/test/test.css","./files/test.css");

// Serve our basic html page at /test. Because of the prior push rules, this will also include the pushed css file.
server.router.addServe("/test","./files/index.html");
```

For more details on HTTP/2 and Push responses, see our Advanced Topic on the subject.

## Paths

Most of the routing stuff above allows you to specify the *path* you want to match against.  The value of path may be one of four possible approaches...

 - A basic path string;
 - A "starts with" path string;
 - An "ends with" path string;
 - or a Regular Expression.

### Basic Paths

A basic *path* is simply a string that would match in it entirety.

```
server.router.add("GET","/test",someHandler);
```

In this case "/test" must match completely for the route to be executed.

### Starts With Paths

A starts with *path* would match against any request where the given *path* matches against the beginning of the request *path*.

```
server.router.add("GET","/test*",someHandler);
```

In this case, any request path that began with "/test" would match the route.

### Ends with Paths

A ends with *path* would match against any request where the given *path* matches against the end of the request *path*.

```
server.router.add("GET","*/test",someHandler);
```

In this case, any request *path* that ended with "/test" would match the route.

### Regular Expression Paths

Finally, a *path* route can be specified as a Regular Expression.

```
server.router.add("GET",/^\/test^/,someHandler);
```

Regular Expressions offer you the most flexibility for advanced *path* handling.

## Controllers

A controller is a special type of routing that allows you to keep logical API behaviour together in a unified class.  Controllers respond to any HTTP method for a given path; so you can write a GET handler and a POST handler together. Controllers are roguhly based on Grails and other frameworks, but with a little more JS magic.

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

### `before()`

Additionally, a controller may implement the `before(path,request,response)` function which will be executed before the corresponding *HTTP Method* function.

### `after()`

Additionally, a controller may implement the `after(path,request,response)` function which will be executed after the corresponding *HTTP Method* function.

### `any()`

In the event the controller does not have a matching *HTTP Method* function, the `any()` function will be called instead. The sub-class of the controller can implement this as a kind of catch-all for request, as desired.  However, not that if the controller doesn't implement it, nothing would occur, which is okay.

## Advanced Techniques

 - HTTP Setup and Configuration
 - HTTPS Setup and Configuration
 - HTTP/2 Setup and Configuration
 - Route ordering and multiple handlers
 - Advanced Controllers
 - HTTP/2 Techniques
 - Servers, Requests, and Responses
 - Custom Servers
 - Custom Routers

## Examples

AwesomeServer ships with a set of examples for your reference.

 - [BasicServer](./examples/BasicServer/README.md): An example of doing a basic HTTP server.

 - [HTTPSServer](./examples/HTTPSServer/README.md): An example of doing a basic HTTPS server including adding a public certificate and a private key.

 - [HTTP2Server](./examples/HTTP2Server/README.md): An example of doing a basic hTTP/2 server including how to push multiple responses for a single request.

 - [BasicController](./examples/BasicController/README.md): An example of implementing a basic controller and routing to it.

 - [ControllerClasses](./examples/ControllerClasses/README.md): An example of implementing multiple controllers and routing with Controller File Routing.

 - [ControllerDirectory](./examples/ControllerDirectory/README.md): An example of using Controller Directory Routing with multiple controllers and sub-directories.

 - [FileServer](./examples/FileServer/README.md): How to build a basic File Server using Server Directory Routing.

 - [HTTP2FileServer](./examples/HTTP2FileServer/README.md): An example of doing a slightly more complicated HTTP/2 server using Push Serve Routing and File Serve Routing fallback.

## The Awesome Engineering Company

AwesomeServer is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

# License

AwesomeServer is released under the MIT License. Please read the  [LICENSE](https://raw.githubusercontent.com/awesomeeng/AwesomeServer/master/LICENSE?token=ABA2_wogpYds4a1qC_4aeUZd8C1in6Qcks5bUiQFwA%3D%3D) file for details.

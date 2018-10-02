# [AwesomeServer](../README.md) > Controllers

This document describes Controllers, how and why to use them, and some of the really awesome things they can do.

## Contents
 - [Why Use Controllers](#why-use-controllers)
 - [Writing a Controller](#writing-a-controller)
 - [Using a Controller](#using-a-controller)
 - [Before, After and Any](#before-after-and-any)
 - [Routing the same Controller Multiple Times](#routing-the-same-controller-multiple-times)
 - [Prebuilt Controllers](#prebuild-controllers)

## Why Use Controllers

A Controller is a dedicated class (and instance of that class) for handling a specific endpoint of your server.  For example, if you want the endpoint `/users`, you can define a `UsersController` that is tasked with handling all of the operations for that endpoint.  Your `UsersController` then implements all of the actions (sometimes call "verbs") that controller can accept expressed as HTTP Methods. Your controller could implement the GET, POST, PUT and DELETE methods within the one controller, thus organizing your endpoint in a single unified structure.

```
const AwesomeServer = require("@awesomeeng/awesome-server");
const AbstractController = AwesomeServer.AbstractController;

class UserController extends AbstractController {
	async get(path,request,response) {
		... do something for GET /users ...
	}

	async post(path,request,response) {
		... do something for POST /users ...
	}

	async put(path,request,response) {
		... do something for PUT /users ...
	}

	async delete(path,request,response) {
		... do something for DELETE /users ...
	}
}
```

```
server.route("/users|/users/*",UsersController);
```

AwesomeServer makes this even easier for you by allowing you to skip over having to require and instantiate the controller and just give it the resolve filename.

```
server.route("/users|/users/*","./UsersController.js");
```

Or even give it a whole directory of controllers (and nested controllers) and AwesomeServer will map them all based on the path and filename structure:

```
server.route("/api*","./controllers");
```

Controllers are a cleaner way to organize your server structure with each controller representing a specific endpoint that acts on a specific action/verb. Yet, also keep in mind that this structure may not support all use cases, so AwesomeServer also supports the industry approach of `route(method,path,function)` as needed.  You may mix an match these as your needs demand. And while AwesomeServer supports the industry approach to routing, AwesomeServer supports and even encourages the use of Controllers instead.

## Writing a Controller

Writing a controller is pretty simple as AwesomeServer does a lot of the heavy lifting for you.

First, we strongly recommend creating a new file for each Controller. So if we are creating a UserController, we might call our file `UserController.js`.

Second, we require `AwesomeServer` and `AwesomeServer.AbstractController`.

```
const AwesomeServer = require("@awesomeeng/awesome-server");
const AbstractController = AwesomeServer.AbstractController;
```

Next, we define our controller class, making sure to extend `AbstractController`.

```
class UserController extends AbstractController {
}
```

Within our controller class we may implement any of the following methods which map to their corresponding HTTP Method names as shown below. Note that you may use the lowercase form, the uppercase form, or the `handleBlah` form, but only implement one of the forms per HTTP Method or you may get conflicting results. (i.e. do not implement both `GET()` and `handleGet()`).

 | Lowercase Form      | Uppercase Form      | `handleBlah` Form      |
 |---------------------|---------------------|------------------------|
 | get(...)            | GET(...)            | handleGet(...)         |
 | post(...)           | POST(...)           | handlePost(...)        |
 | put(...)            | PUT(...)            | handlePut(...)         |
 | delete(...)         | DELETE(...)         | handleDelete(...)      |
 | connect(...)        | CONNECT(...)        | handleConnect(...)     |
 | head(...)           | HEAD(...)           | handleHead(...)        |
 | options(...)        | OPTIONS(...)        | handleOptions(...)     |
 | trace(...)          | TRACE(...)          | handleTrace(...)       |
 | patch(...)          | PATCH(...)          | handlePatch(...)       |

Each method function has the signature `(path,request,response)`.

 - **path** - This is the URL path string, but it has the portion of the path that matched this controller removed from it.  Thus if your controller was mapped to `/users/*` as above, and the request URL was `/users/username123`, the *path* value here would be `username123`.  This is done to let you work more easily with the endpoint information passed in.  The Path Matcher you provide when registering the route will remove the matched portion of the path based in how it matches. You may want to review or [Paths Documentation](./Paths.md) for more details.

 - **request** - This is the Request object which you may use to obtain more information about the request and any request content if contained.  You should definately read our [Request Documentation](./Requests.md) to understand what the Request object can do for you.

 - **response** - This is the Response object which you may use to obtain more information about the state of the response and any to write your response content.  You should definately read our [Response Documentation](./Responses.md) to understand what the Response object can do for you.

Each method may return a Promise if asyncronous operations need to occur, or they may not.  AwesomeServer will `await` any Promise returned or otherwise move onward.

Each method function may be asyncronous via the `async` keyword, if desired, and thus internally `await` as needed.

Here's an example controller method for our UsersController:

```
class UserController extends AbstractController {
	async get(path,request,response) {
		let username = path;
		if (!username) return response.writeError(404,"Missing username.");

		let user = await userDB.queryUser(username);
		if (!user) return response.writeError(404,"Username was not found.");
		response.writeJSON(200,user);
	}
}
```

In the above example, we make sure our GET was called with an argument as in `GET /users/username123`. If we got a `username` argument, we query our `userDB` service (whatever that might be), to get our `user` object.  If no user was found, we return a 404. If a user was returned, we respond with the JSON version of the `user` object.

## Using a Controller

Once we have defined our controller, for example `UserController.js` we need to create a routing to it.  In the code where we defined our server, we add our routes.

```
const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTPServer();

... add routes here ...

server.start();
```

There are several forms you can use to add a controller as a route. Use the mannar that best suits your style and need, but we do suggest the **filename** or **directory** approaches below.

#### Route using an instance of a Controller Class

**server.route(method,path,controllerInstance)** - Takes a controller instance (aka `new MyController()`) and maps that instance to the given method and path.
- **method**: [string] Optional. One of the HTTP Method names or "*".  If this is ommited, which we recommend for controller, all methods will be routed through. If this is included, only the matching methods will get routed.
- **path**: [string|RegExp|PathMatcher] The path matcher to match against.
- **controllerInstance**: [AbstractController] The controller to execute.

#### Route using a Controller Class

**server.route(method,path,controllerClass)** - Takes a controller class, instantiates it, and maps that instance to the given method and path.
- **method**: [string] Optional. One of the HTTP Method names or "*".  If this is ommited, which we recommend for controller, all methods will be routed through. If this is included, only the matching methods will get routed.
- **path**: [string|RegExp|PathMatcher] The path matcher to match against.
- **controllerClass**: [AbstractController] The controller class to instantiate to execute.

#### Route using a Filename

**server.route(method,path,filename)** - If the given filename exists, is a JavaScript file, exports a class that inherits from `AbstractClass` or exports an instance of a class that inherits from `AbstractClass`, this approach will creates an instance of the class (or use the provided instance), and map that instance to the given method and path.
- **method**: [string] Optional. One of the HTTP Method names or "*".  If this is ommited, which we recommend for controller, all methods will be routed through. If this is included, only the matching methods will get routed.
- **path**: [string|RegExp|PathMatcher] The path matcher to match against.
- **filename**: [AbstractController] The filename to require, instantiate, and map.

Note that the file must exist when the `server.route()` method is executed.  The file must be valid JavaScript. The file must export a class that extends `AbstractController` or an instance of a class that extends `AbstractController`.

#### Route using a Directory

**server.route(method,path,filename)** - For a given directory, walk the directory and all of its sub-directories, and any file that ends with `.js` which satisfies the criterea for **Route using a Filename** from above, will be mapped to the given route and sub-directory and filename.
- **method**: [string] Optional. One of the HTTP Method names or "*".  If this is ommited, which we recommend for controller, all methods will be routed through. If this is included, only the matching methods will get routed.
- **path**: [string|RegExp|PathMatcher] The path matcher to match against.
- **filename**: [AbstractController] The filename to require, instantiate, and map.

This approach essentially calls **server.route(method,path,filename)** for each filename found in the given directory and its sub-directories. The *path* argument for this nested **server.route()** is a combination of the original path, any sub-directories involved, and the filename itself.  So if we had the following structure...
```
files/
 one.js
 two.js
 three.js
 three/
   four.js
```
> and routed `server.route("*","api","./files");` the resulting routes would be `/api/one`, `/api/two`, `/api/three`, and `/api/three/four`. One route for each matching `.js` file.

## Routing the same Controller Multiple Times

You may certainly use the same controller multiple times for multiple routes:

```
server.route("/user","./UserController.js");
server.route("/users","./UserController.js");
server.route("/user/*","./UserController.js");
server.route("/users/*","./UserController.js");
```

However, it is important to note that each call shown in the example above may create a new instance of the UserController. Controllers are expected to be stateless, and thus separate instances should not be impactful.

## Before, After, and Any

There are three magic functions inside of each controller that you may opt to provide if you need thier specialized behavior.  These three functions are detailed below.

#### `before()`

Additionally, a controller may implement the `before(path,request,response)` function which will be executed before the corresponding *HTTP Method* function. That is `before()` will be executed before a `get()` or `handlePost()`.  Before methods are a great place to do some work you need to setup for all controller methods.

```
class UserController extends AbstractController {
	before(path,request,response) {
	}
}
```

`before()` is just like one of the HTTP Method functions you writes and thus `before()` may be an `async` function and `before()` may return a Promise.

#### `after()`

Additionally, a controller may implement the `after(path,request,response)` function which will be executed after the corresponding *HTTP Method* function. That is `after()` will be executed after a `get()` or `handlePost()`.  After methods are a great place to do some work you need to teardown for all controller methods.

```
class UserController extends AbstractController {
	after(path,request,response) {
	}
}
```

`after()` is just like one of the HTTP Method functions you writes and thus `after()` may be an `async` function and `after()` may return a Promise.

#### `any()`

In the event the controller does not have a matching *HTTP Method* function, the `any()` function will be called instead if the `any()` function exists. The sub-class of the controller can implement this as a kind of catch-all for request, as desired.  However, note that if the controller doesn't implement it, nothing would occur, which is okay.

```
class UserController extends AbstractController {
	any(path,request,response) {
	}
}
```

`any()` is just like one of the HTTP Method functions you writes and thus `any()` may be an `async` function and `any()` may return a Promise.

## Prebuilt Controllers

AwesomeServer comes with several pre-built controllers you can use if you desire, although directly using them is not required as they are exposed to you in other ways detailed below.

**AwesomeServer.controllers.RedirectController** - Used when you call `server.redirect()` this will respond to incoming requests with a temporary (302) or permanent (301) redirect response.

**AwesomeServer.controllers.FileServeController** - Used when you call `server.serve()` with a specific filename, this will respond to incoming GET request with the contents of the given file.

**AwesomeServer.controllers.DirectoryServeController** - Used when you call `server.serve()` with a specific directory, this will respond to incoming requests with a corresponding file if found in the given directory.

**AwesomeServer.controllers.PushServeController** - Used when you call `server.push()` this will respond to incoming requests by pushing the contents of the given filename as the given path. Only supported for HTTP/2 or other push enabled servers.

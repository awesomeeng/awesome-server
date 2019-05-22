# [AwesomeConfig](../README.md) > Introducing AwesomeServer

AwesomeServer is a powerful http/https/http2 web framework for building enterprise ready node.js applications. Unlike products like express or fastify AwesomeServer is focused on allowing developers to easily write endpoints/controllers instead of stringing together a collection of middleware libraries. It provides easy but powerful routing structure, an opt-in controller based structure, consistent and helpful request and response objects, simple http/2 cache pushing, and integerated logging support.

Using AwesomeServer is super simple, and fairly similar to other solutions, but also slightly different.  Getting started you simply instantiate AwesomeServer, add one or more servers, add one or more routes, and go.

In particular, AwesomeServer encourages you to write controllers, independant classes that handle a specific set of behaviours for an API endpoint.  With a controller you say, for example, that the `/auth/session` route will be handled by the `AuthSessionController`.  You write the AuthSessionController in its own `.js` file and just route that with AwesomeServer.  Then whenever a request comes in that matches the `/auto/session` route, regardless of HTTP method, AwesomeServer routes it to an instance of the controller class.

Controllers allow developers to keep their API code separate and clean and not require a middleware solution or directory scanning be implemented.  All that is handled already for you with AwesomeServer.

## Key Features

 - **HTTP, HTTPS, or HTTP/2**. AwesomeServer servers HTTP or HTTPS or HTTP/2 endpoints. Choose one or mix and match in a single instance to serve multiple servers from a single web framework. Or even add your own type of servers such as a socket.io or quic server.

 - **HTTP/2 Push and Preloading**. In addition to merely responding to HTTP/2 request, AwesomeServer allows developers to do HTTP/2 pushes and preloading with minimal overhead.

 - **Classic Routing**. AwesomeServer allows you to do classic web framework routing such as handling HTTP Method X along path Y into predefined functions.

 - **Controllers**. Or you can use AwesomeServer's builtin controller structure and organize your code more efficiently. To make it even easier, you can route to a specific controller or route an entire directory of controllers.

 - **Request Helpers**. Built in helpers for common request object needs like getting the User Agent or reading the body content.

 - **Response Helpers**. Built in helpers for common response object needs like setting headers, or responding with JSON/HTML/CSS/Text easily.

 - **Static Files**. Serve static files or whole directories easily with AwesomeServer's builtin commands.

 - **Redirects**. AwesomeServer makes adding redirects simple without the need to write a custom router.

 - **async/await**. AwesomeServer is written with promises and async/await specifically in mind.

 - **No External Dependencies**. AwesomeConfig is written and maintained by The Awesome Engineering Company and has no dependency that was not written by us. This means consistency of code throughout the product and that we have zero dependencies that were not written inhouse.  This means safer code for you and your product.

 - **Free and Open**. AwesomeConfig is released under the MIT licene and complete free to use and modify.





## Getting Started

AwesomeConfig is super easy to use.

#### 1). Install It.

```shell
npm install @awesomeeng/awesome-config
```

#### 2). Require it.

```javascript
let config = require("@awesomeeng/awesome-config");
```

#### 3). Initialize it.

```javascript
config().init();
```

Those of you paying attention will notice that the `init()` function is called not on the config object, but on the execution of the config function as specified thus: `config()`.  This is the tricky to how AwesomeConfig gets around having reserved words.  It takes a minute to get used to, but it becomes pretty obvious if you forget and use `config.init()` by mistake.

#### 4). Add Configuration.
```javascript
config().add({
	a: {
		javascript: "Object"
	}
});
config().add(`
	"or": {
		"a": {
			"string": "of JSON"
		}
	}
`);
config().add(`
	or.use.our.custom.notation: "which allows"
	json.or: {
		key: {
			value: "pairs"
		}
	}
`);
config().add("./or-config-files.json");
config().add("./or-config-directories");
```

With `config().add()` you add one or more configuration blocks to AwesomeConfig.  A configuration block can be...

 - **A JavaScript object**
 ```javascript
 config().add({
 	a: {
 		javascript: "Object"
 	}
 });
 ```

 - or **A JSON String**
 ```javascript
 config().add(`
 	"or": {
 		"a": {
 			"string": "of JSON"
 		}
 	}
 `);
 ```

 - or **An AwesomeConfig Notation String**
 ```javascript
 config().add(`
	or.use.our.custom.notation: "which allows"
 	json.or: {
 		key: {
 			value: "pairs"
 		}
 	}
 `);
 ```

 - or **A Filename**
 ```javascript
 config().add("./or-config-files.json");
 ```

 - or **A Directory**
 ```javascript
 config().add("./or-config-directories");
 ```

You can call `config().add()` as many times as you want adding as many configuration blocks as you want.  When AwesomeConfig is started (coming up in the next section), AwesomeConfig takes all of the configuration objects and merges them together into a single unified configuration.

Again, you will notice that we are using `config()` instead of `config` when adding our configuration.  A good rule of thumb to remember is if you are calling a function on configuration like `init()` or `add()` or `start()`, you do it on the `config()` execution.

#### 5). Start It.
```javascript
config().start();
```

After all your configuration blocks have been added, you start AwesomeConfig.  Once `start()` is called your configuration merge together into a single unified view, all variables and conditions are resolved, and the entire unified configuration is made immutable.

#### 6). Use It!
```javascript
console.log(config.a.javascript); // "Object"
console.log(config.or.use.our.custom.notation); // "which allows"
```

The `config` object we required earlier now has access to the unified config and functions just like any JavaScript object would.

Additionally you can use it in any other module working in the same process:
```javascript
let config = require("@awesoemeng/awesome-config");
console.log(config.json.or.key.value); // "pairs"
```

## Documentation

That's the basics of AwesomeConfig, but there is of course a lot more to it.

At this point, we suggest you check the [project readme](https://github.com/awesomeeng/awesome-config) out. Additionally there is specific documentation for Variables and Placeholders, Conditions, and the like.

- [Understanding Merging](https://github.com/awesomeeng/awesome-config)
- [Understanding Merging](https://github.com/awesomeeng/awesome-config/blob/master/docs/Merging.md)
- [Variables and Placeholders](https://github.com/awesomeeng/awesome-config/blob/master/docs/VariablesAndPlaceholders.md)
- [Condition Expressions](https://github.com/awesomeeng/awesome-config/blob/master/docs/Conditions.md)

## AwesomeStack

AwesomeStack is a free and open source set of libraries for rapidly building enterprise ready nodejs applications, of which, AwesomeConfig is one part.  Each library is written to provide a stable, performant, part of your application stack that can be used on its own, or part of the greater AwesomeStack setup.

AwesomeStack includes...

 - **[AwesomeServer](https://github.com/awesomeeng/awesome-server)** - A http/https/http2 API Server focused on implementing API end points.

 - **[AwesomeLog](https://github.com/awesomeeng/awesome-log)** - Performant Logging for your application needs.

 - **[AwesomeConfig](https://github.com/awesomeeng/awesome-config)** - Powerful configuration for your application.

 - **[AwesomeCLI](https://github.com/awesomeeng/awesome-cli)** - Rapidly implement Command Line Interfaces (CLI) for your application.

All AwesomeStack libraries and AwesomeStack itself is completely free and open source (MIT license), maintained by The Awesome Engineering Company, and has zero external dependencies. This means you can have confidence in your stack and not spend time worrying about licensing and code changing out from under your.

You can learn more about AwesomeStack here: https://github.com/awesomeeng/awesome-stack

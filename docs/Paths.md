# [AwesomeServer](../README.md) > Paths

This document details the various types of Paths you can provide for routing with AwesomeServer.

## Contents
 - [Basic Paths](#basic-paths)
 - [Positional Parameter Paths](#positional-parameter-paths)
 - [Regular Expression Paths](#regular-expression-paths)
 - [Custom Paths](#custom-paths)

## Basic Paths

Basic paths are string expressions that may include wildcard hints to where in the path portion of the incoming request URL the matching should occur.  AwesomeServer has five types of basic paths: **Exact**, **Starts With**, **Ends With**, **Contains**, or **Or Expression**.

#### Exact

An exact *path* is a string that would match the path portion of the request url exactly.

```
server.route("GET","/test",someHandler);
```

In this case "/test" must match completely for the route to be executed.

#### Starts With

A starts with *path* is a string that would match the beginning of the path portion of the request url.

```
server.route("GET","/test*",someHandler);
```

In this case, any request path that began with "/test" would match the route.

#### Ends With

An ends with *path* is a string that would match the ending of the path portion of the request url.

```
server.route("GET","*/test",someHandler);
```

In this case, any request *path* that ended with "/test" would match the route.

#### Contains

A contains *path* is a string that would match any part of the path portion of the request url, including the beginning or ending.

```
server.route("GET","*/test/*",someHandler);
```

In this case, any request *path* that contained "/test/" would match the route.

#### Or Expression

An Or Expression *path* is a special version of string paths. It allows you to combine any of the above string paths together with the Or "|" character, and returns true for a match wherein any one of the Or Expression portions is a match.

```
server.route("GET","*/test/*|/hello",someHandler);
```

In this case, any request *path* that contained "/test/" OR exactly was "/hello" would match the route.

## Positional Parameter Paths

Positional Parameter Paths are a common use case for REST expressions.  A Positional Parameter Path is one that expresses some path as containing one or more parameters. Here's an example:

	/test/:id

In this case, the path has one positional parameter, `id`. This would match `/test/abc` or `/test/123` but would not match `/test` or `/test/` or `/test/abc/123`.

A positional parameter is indicated by a colon `:` character followed by a name consisting of one or more characters, numbers, or underscores.  No other character can be used in naming.  So `:id` and `:My_First_Id` are valid, but `:this$field` is not.  Generally speaking, keep your parameter names to simple words.

When using a Positional Parameter Path, the `path` argument received by your request handler is an Object instead of the remaining path. This is because positional parameter paths are otherwise exact matches and the path string returned would be empty.

The Object sent as the `path` argument to your request handler will contain all the values of the positional parameters as key/value pairs.  **All values for the positional parameters values are always of type string.**  So, a Positional Parameter Path of `/test/:id/:value` would send the following object as the path when handling the `/test/abc/123` route:

```javascript
{
	id: "abc",
	value: "123"
}
```

**Positional Parameters cannot be used in direct conjunction with wildcard path matchers described above.**  `/test/:id/*` would not be a valid positional parameter path, but instead would be treated as a Starts With Path.

Positional parameters can be used in conjunction with the Or Matcher also described above.

Here is an entire example of using Positional Parameter Paths:

```javascript
const AwesomeServer = require("@awesomeeng/awesome-server");

let server = new AwesomeServer();
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
server.route("*","/test/:id/:value",(params,request,response)=>{
	return response.writeText("I received an id of '"+params.id+"' and a value of '"+params.value+"'.");
});
server.start();
```

## Regular Expression Paths

A Regular Expression *path* is a RegExp that would match against the path and execute if the match is true.

```
server.route("GET",/^\/test^/,someHandler);
```

Regular Expressions offer you a ton of flexibility for advanced *path* handling.

## Custom Paths

For the most flexibility in paths, AwesomeServer provides you the ability to define you own custom path matcher class by extending the `AwesomeServer.AbstractPathMatcher` class. You then provide an instance of this sub-class as your path argument.

```
class MyMatcher extends AwesomeServer.AbstractPathMatcher {
	...
};
server.route("*",new MyMatcher(),handler);
```

In extending `AwesomeServer.AbstractPathMatcher` you are required to provide the implementation for three methods:

- `matches(path)` - Which is called with an incoming request's *path* and returns *true* if it is a match;
- `subtract(path)` - Which is called with an incoming requests *path* and returns the revised *path* if the matching portion of the *path* was removed, but only if `matches(path)` returns *true*.
- `toString()` - Which returns a string displayable version of this patch matcher, mostly used by logging.

Here's an example...
```
"use strict";

const AbstractPathMatcher = require("AwesomeServer").AbstractPathMatcher;

const $PATH = Symbol("path");

class StringEndsWithMatcher extends AbstractPathMatcher {
	constructor(path) {
		super();

		this[$PATH] = path;
	}

	get path() {
		return this[$PATH];
	}

	toString() {
		return "\""+this.path+"\"";
	}

	match(path) {
		return path.endsWith(this.path.slice(1));
	}

	subtract(path) {
		if (!this.match(path)) return path;
		return path.slice(0,-(this.path.length-1));
	}
}

module.exports = StringEndsWithMatcher;
```

The above example is the Ends With matcher used by AwesomeServer. You can see other examples in our code [here](../src/matches).

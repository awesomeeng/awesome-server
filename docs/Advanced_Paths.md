# AwesomeServer: Paths

This document details the various types of Paths you can provide for routing with AwesomeServer.

## Contents
 - [Basic Paths](#basic_paths)
 - [Regular Expression Paths](#regular_expression_paths)
 - [Custom Paths](#custom_paths)

## Basic Paths

Basic paths are string expressions that may include wildcard hints to where in the path portion of the incoming request URL, the matching should occur.  AwesomeServer has five types of basic paths: **Exact**, **Starts With**, **Ends With**, **Contains**, or **Or Expression**.

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

- `matches(path)` - Which is called with an incoming requests path and returns true if it is a match;
- `subtract(path)` - Which is called with an incoming requests path and returns the revised path if the matching portion of the path was removed, but only if `matches(path)` returns true.
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

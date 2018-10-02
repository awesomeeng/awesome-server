# [AwesomeServer](../README.md) > HTTP2 Techniques

This document details some additional HTTP/2 techniques that may come in handy when using HTTP/2 with AwesomeServer.

## Contents
 - [HTTP2 in AwesomeServer](#http2-in-awesomeserver)
 - [Routing](#routing)
 - [Pushing with the Response](#pushing-wth-the-response)
 - [Push Routing](#push-routing)

## HTTP2 in AwesomeServer

AwesomeServer supports HTTP/2 connections using NodeJS's HTTP/2 Compatability Mode.  This makes HTTP/2 request and responses look and behave similar to HTTP/HTTPS requests and responses. Additionally, AwesomeServer provides some extra shortcut tools for HTTP/2 requests and responses to make working with HTTP/2 a little easier.

If you have not yet read our [HTTP/2 Documentation](./HTTP2.md) that is an excellent place to start.

## Pushing with the Response

One particular technique to be aware of is inside of your route functions or controllers, you can push using the response object.  This is done by calling the `response.push()` method, or one of its shortcuts `response.pushText()`, `response.pushHTML()`, `response.pushCSS()`, `response.pushJSON()`, or `response.pushServe()`.

```
server.route("*","/hello",(path,request,response)=>{
	await response.push("/index1.css","text/css","p { font-size:48px; color: red; }");
	await response.push("/index2.css","text/css","p { font-weight: bold; }");
	await response.writeHTML("<html><head><link rel='stylesheet' type='text/css' href='index1.css'><link rel='stylesheet' type='text/css' href='index2.css'></head><body><p>Hello world.</p></body></html>");
	await response.end();
});
```

## Push Routing

Another HTTP/2 technique you can employ is called Push Routing. This is used when you know you want to push a specific file content whenever a given route is encountered.  This can be particularly useful to push things you know will be need with a group of routes. For example, for any `*.html` file you route you could push the corresponding CSS file automatically.

```
// Fallback and serve the CSS straight up if the http2 stuff doesnt work for some reason.
server.serve("/hello/hello.css",server.resolve("./files/hello.css"));

// Push our CSS to any page that matches /hello or /hello/*
server.push("/hello/*","/hello/hello.css",server.resolve("./files/hello.css"));
server.push("/hello","/hello/hello.css",server.resolve("./files/hello.css"));

// Serve our basic html page at /hello. Because of the prior push rules, this will also include the pushed css file.
server.serve("/hello",server.resolve("./files/index.html"));
server.serve("/hello/index.html",server.resolve("./files/index.html")); // sometimes firefox likes to help and redirect to index.html. this works around that.
```

In our example, we push `hello.css` for any time the `/hello` or `/hello/*` path is requested.

It is also important to have a fallback route for `hello.css` in case it is directly requested in the event the browser did not accept the push request.

Also note in our example that our fallback for `hello.css` comes first. Ordering is important in routing and this ordering will serve the `hello.css` and then stop routing because the response is finished at that point. This the two `server.push()` calls and the bottom two `server.server()` routes are skipped. You can read more about [Routing Ordering](./Routing.md#routing_order_and_multiple_routing) in our [Routing documentation](./Routing.md).

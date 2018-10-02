# [AwesomeServer](../README.md) > HTTP Setup and Configuration

This document details how to work with HTTP Servers in relation to AwesomeServer including configuration, request, and responses.

## Contents
 - [Usage](#usage)
 - [Configuring](#configuring-http-servers)
 - [Requests](#http-requests)
 - [Responses](#http-responses)

## Usage

To create an HTTP Server for usage with AwesomeServer you use the `server.addHTTPServer(config)` method and then `start()` AwesomeServer.  It takes a configuration option, as described below.

When a new request is received on the HTTP Server, it takes the incoming request/response objects and wraps them in custom request/response objects.  The details of these wrapped request/response objects is below.

Note that it is entirely possible to have multiple calls to `server.addHTTPServer(config)` which are listening on different ports with different configurations, but using the same underlying AwesomeServer for handling.

## Configuring HTTP Servers

When calling `server.addHTTPServer(config)` you may pass an optional configuration object.  This object has the shape described below, but is also fully compatable with the configuration object passed to both **nodejs' `http.createServer()` function** and **nodejs' `server.listen(options)` function.**

The example below shows the default configuration object you would get if you did not pass anything to `server.addHTTPServer()`.

```
let config = {
	host: "localhost",
	port: 7080
};
```

> **host**: [string] specifies the host interface to bind to. AwesomeServer sets this to "localhost" by default. To bind to all interfaces change this to "0.0.0.0".

> **port**: [number] the interface port to bind to. For a random port, set to 0.

If you need greater fidelity of configuration, please see the following for more information on options:

 - [nodejs http.createServer() options](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_createserver_options_requestlistener)
 - [nodejs net.server.listen() options](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback)

## HTTP Requests

Each incoming request that is received by AwesomeServer has both a request and a response object. When the incoming request is received by the HTTP server, its request object is wrapped in a custom AwesomeServer HTTP Request object.  Likewise, its response object is wrapped in a custom AwesomeServer HTTP Response object. We do this to provide a more consistent, simplified request structure.

An AwesomeServer HTTP Request object is an instance of `AwesomeServer.http.HTTPRequest` which is itself an instance of `AwesomeServer.AbstractRequest`. if you need access to the original nodejs IncomingMessage object, you can simply use the `request.original` getter to obtain it.

The Request object has a number of convenience methods on it to help in dealing with incoming requests.  These include getters for...

> **request.original**: [IncomingMessage] Returns the underlying nodejs `http.IncomingMessage` object.

> **request.method**: [String] Returns the request HTTP Method.

> **request.url**: [URL] Returns the parsed URL of the request.

> **request.path**: [String] Returns the path portion of the parsed URL of the request.

> **request.query**: [Object] Returns the parsed query portion of the parsed URL of the request.

> **request.querystring**: [String] Returns the srting query portion of the parsed URL of the request.

> **request.headers**: [Object] Returns an object of all the headers of the request.

> **request.contentType**: [String] Returns the mime-type portion of the `content-type` header.

> **request.contentEncoding**: [String] Returns the charset (encoding) portion of the `content-type` header.

> **request.useragent**: [String] Returns the `user-agent` header, if any.

You can read all about the HTTPRequest class and AbstractRequest class in our API Documentation.

#### Reading the Request Content

One of the little conveniences AwesomeServer provides to use by wrapping things in HTTPRequest, is easier access to reading the incoming content of POST, PUT and PATCH methods.  HTTPRequest provides three extra methods for doing the reading and making your life a whole lot easier.

> **`request.read()`** - This function returns a Promise that will resolve to a Buffer when the content has been read entirely. This will also store the read content so additional calls to `read()` will return faster.
  - returns **Promise > Buffer**

> **`request.readText(encoding="utf-8")`** - This uses `read()` above, but before returning it decodes the Buffer into a String and returns that instead. You may pass an optional *encoding* parameters to it. This will reject if the string cannot be decoded for some reason.
 - **encoding**: [string] Text encoding to parse buffer into. Default to `utf-8`.
 - returns **Promise > String**

> **`request.readJSON(encoding="utf-8")`** - Likewise, this uses `read()` above, but before returning it decodes the Buffer into a String and then parses the String with `JSON.parse()`. You may pass an optional *encoding* parameters to it. This will reject if the string cannot be decoded or `JSON.parse()` fails.
- **encoding**: [string] Text encoding to parse buffer into. Default to `utf-8`.
- returns **Promise > String**

## HTTP Responses

Each request that is received by AwesomeServer has both a request and a response object. When the request is received by the HTTP server, the original response is wrapped in a custom AwesomeServer Response object.  We do this to provide a more consistent, simplified response structure.

An AwesomeServer Response object is an instance of `AwesomeServer.AbstractResponse`. For HTTP response, the response object is also an instance of HTTPResponse, but that is not exposed to the developer.

The Response object has a number of convenience methods on it to help dealing with incoming requests.  However, if you need access to the original nodejs IncomingMessage object, you can simply use the `response.original` getter to obtain it.

Here's a quick rundown of the Response object members and methods.

> **response.original**: [[ServerResponse](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_serverresponse)] Returns the wrapped ServerResponse received from the underlying server.  This allows you access to the "raw" response, if you so desire it.

> **response.finished** [boolean] Returns *true* if the response has been finished, which is caused by a call to `response.end()`.

> **response.statusCode** [number] Returns the number HTTP Status Code which was set by a prior call to `response.writeHead()`.

> **response.contentType** [string] Returns the `content-type` header if set by a call to `response.writeHead()`. This returns only the MIME-type portion of Content-Type. The charset or other parameters are removed.

> **response.contentEncoding** [string] Returns the charset portion of the `content-type` header. If no encoding was passed as part of the `content-type` header, this will return the assumed `utf-8` setting.

> **response.pushSupported** [boolean] Returns *true* if HTTP/2 push is supported by the response object. For HTTP responses, this will always return false.

### Writing the Response

One of the little conveniences AwesomeServer provides to use by wrapping things in HTTPResponse, is easier access to writing the outgoing response.  HTTPResponse provides several extra methods for doing the writing and making your life a whole lot easier.

> **response.writeHead(statusCode,statusMessage,headers)** [void] Used to initiate a response for the request. This is more or less a straight pass through to the [original method](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_response_writehead_statuscode_statusmessage_headers) in nodejs.
  - **statusCode**: optional, otherwise 200 is assumed. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **statusMessage**: optional
  - **headers**: optional
  - returns: **void**

> **response.write(data,encoding)** [Promise > void] Used to send a chunk of response data for the request. This function returns a Promise that will resolve when the data is written to the outgoing stream. This is more or less a straight pass through to the [original method](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_response_write_chunk_encoding_callback) in nodejs.
  - **data** may be a Buffer or a string.
  - **encoding**: optional
  - returns: **Promise > void**

> **response.end(data,encoding)** [Promise > void] Used to finish the process of writing response data for the request. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed). This is more or less a straight pass through to the [original method](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_response_write_chunk_encoding_callback) in nodejs.
  - **data** is an optional block of data to write before ending.
  - **encoding**: optional
  - returns: **Promise > void**

> **response.pipeFrom(readable)** [Promise > void] Initiates a pipe from the given *readable* into the response outgoing stream.  This is similar to the underlying nodejs `response.pipe()` method, but you pass the readable into it, instead of the other way around in a normal pipe.
  - **readable** is a [nodejs Readable Stream](https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_readable) and required.
  - returns: **Promise > void**

> **response.writeText(statusCode,content,headers=null)** [Promise > void] A shortcut method for returning content with the MIME-type of `text/plain`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).
  - **statusCode** is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **content** is the Buffer or string content to write out.
  - **headers** is optional.
  - returns: **Promise > void**

> **response.writeHTML(statusCode,content,headers=null)** [Promise > void] A shortcut method for returning content with the MIME-type of `text/html`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).
  - **statusCode** is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **content** is the Buffer or string content to write out.
  - **headers** is optional.
  - returns: **Promise > void**

> **response.writeCSS(statusCode,content,headers=null)** [Promise > void] A shortcut method for returning content with the MIME-type of `text/css`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).
  - **statusCode** is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **content** is the Buffer or string content to write out.
  - **headers** is optional.
  - returns: **Promise > void**

> **response.writeJSON(statusCode,content,headers=null)** [Promise > void] A shortcut method for returning content with the MIME-type of `application/json`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).
  - **statusCode** is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **content** is the Buffer or string content to write out.
  - **headers** is optional.
  - returns: **Promise > void**

> **response.writeError(statusCode,content,headers=null)** [Promise > void] A shortcut method for returning errors and error messages. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).
  - **statusCode** is required and should be a 400 or higher number. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **content** is the Buffer or string content to write out. Optionally, *content* can be a JavaScript Error object, and writeError will tease it into a more viewable plain text structure for outputting.
  - **headers** is optional.
  - returns: **Promise > void**

> **response.serve(statusCode,contentType,filename,headers=null)** [Promise > void] A utility method for serving the contents of a given filename as the given `content-type`. This function will call `response.writeHead()`, open the given filename, pipe its content to the outgoing stream, and call `response.end()` when completed. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed). If the filename is not found or otherwise not readable, the Promise will reject with an exception.
  - **statusCode** is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.
  - **contentType** should be a valid MIME-type. If *contentType* is *null*, AwesomeServer will attempt to guess the MIME-type based on the filename, or will use `application/octet-stream` otherwise.
  - **filename** is the resolved filename to be served.
  - **headers** is optional.
  - returns: **Promise > void**

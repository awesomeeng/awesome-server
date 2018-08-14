# AwesomeServer: Advanced HTTP Setup Documentation

This document details how to work with HTTP Servers in relation to AwesomeServer including configuration, request, and responses.

## Contents
 - [Usage](#usage)
 - [Configuring](#configuring-http-servers)
 - [Requests](#http-requests)
 - [Responses](#http-responses)

## Usage

To create an HTTP Server for usage with AwesomeServer you use the `server.addHTTPServer(config)` method and then `start()` AwesomeServer.  It takes a configuration option, as described below.

When a new request is received on the HTTP Server, it takes the incoming request/response objects and wraps them in a custom request/response object.  The details of these wrapped request/response objects is below.

Note that it is entirely possible to have multiple calls to `server.addHTTPServer(config)` which are listening on different ports with different configurations, but using the same underlying AwesomeServer for handling.

## Configuring HTTP Servers

When calling `server.addHTTPServer(config)` you may pass an optional configuration object.  This object has the shape described below, but is also fully compatable with the configuration object passed to both [nodejs' `http.createServer()` function](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_createserver_options_requestlistener) and [nodejs' `server.listen(options)` function.](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback).

The example below shows the default configuration object you would get if you did not pass anything to `server.addHTTPServer()`.

```
let config = {
	host: "localhost",
	port: 7080,
	path: null,
	backlog: 511,
	exclusive: false,
	readableAll: false,
	writableAll: false,
	IncomingMessage: null,
	ServerResponse: null
};
```

 - **host**: specifies the host interface to bind to. AwesomeServer sets this to "localhost" by default. To bind to all interfaces change this to "0.0.0.0".

 - **port**: the interface port to bind to. For a random port, set to 0.

 - **path**: See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback).

 - **backlog**:  See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback).

 - **exclusive**:  See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback).

 - **readableAll**:  See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback).

 - **writableAll**:  See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback).

 - **IncomingMessage** See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_createserver_options_requestlistener). Note that the request that is routed through AwesomeServer gets wrapped in AwesomeServer's custom HTTP Request object.

 - **ServerResponse**:  See [nodejs documentation](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_createserver_options_requestlistener). Note that the response that is routed through AwesomeServer gets wrapped in AwesomeServer's custom HTTP Response object.

## HTTP Requests

Each request that is received by AwesomeServer has both a request and a response object. When the request is received by the HTTP server, the original request is wrapped in a custom AwesomeServer Request object.  We do this to provide a more consistent, simplified request structure.

An AwesomeServer Request object is an instance of `AwesomeServer.AbstractRequest`. For HTTP request, the request object is also an instance of HTTPRequest, but that is not exposed to the developer.

The Request object has a number of convenience methods on it to help dealing with incoming requests.  However, if you need access to the original nodejs IncomingMessage object, you can simply use the `request.original` getter to obtain it.

Here's a quick rundown of the Request object members and methods.

**request.original** > [IncomingMessage](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage)

  Returns the wrapped IncomingMessage received from the underlying server.  This allows you access to the "raw" request, if you so desire it.

**request.origin** > string

  Returns the origin hostname/port if it can be determined from the IncomingMessage.  In many cases this cannot always be determinedm in which case this would return an empty string.

**request.method** > string

  Returns the HTTP Method of this request. The method will always be uppercased.

**request.url** > [URL](https://nodejs.org/dist/latest-v10.x/docs/api/url.html)

  Returns a full parsed [URL object](https://nodejs.org/dist/latest-v10.x/docs/api/url.html) representing this request.

**request.path** > string

  Returns the unmodified path from the `request.url` above. It's important to note that when a route is called it gets three arguments: path,request,response.  The *path* argument is a **modified** version of the path, relative to the current route. The `request.path` member differs in that it has not been modified.

**request.query** > Object

  Returns the parsed query (aka search) portion of the URL. If no query portion was given this will return an empty object.

**request.querystring** > string

  Returns the string contents of the query (aka search) portion of the URL.

**request.headers** > Object

  Returns an object representing all of the headers passed as part of this request.

**request.contentType** > string

  Returns the string `content-type` header. This returns only the MIME-type portion of Content-Type. The charset or other parameters are removed.

**request.contentEncoding** > string

  Returns the charset portion of the `content-type` header. If no encoding was passed as part of the `content-type` header, this will return the assumed `utf-8` setting.

**request.useragent** > string

  Returns the `user-agent` header, if any was given.

**request.read()** > Promise > Buffer

  Used to read the content body of the request, if any was given. This function will return a Promise that will resolve later into a Buffer. Once called this will cache the Buffer content so subsequent calls will return faster.

  - **Returns**: Promise > Buffer

**request.readText()** > Promise > string

  An alternative method of `read()` that will return a Promise which resolves to a String of the request content body, if any. This will attempt to use the encoding of the `content-type` header, or `utf-8` if none was given. This Promise will reject if the content body cannot be decoded into a string.

  - **Returns**: Promise > string

**request.readJSON()** > Promise > any

  An alternative method of `read()` that will return a Promise which resolves to the result of running `JSON.parse()` on the returned string from `readText()`. This Promise will reject if the content body cannot be decoded into a string, or if the content body cannot be parsed as JSON.

  - **Returns**: Promise > any

## HTTP Responses

Each request that is received by AwesomeServer has both a request and a response object. When the request is received by the HTTP server, the original response is wrapped in a custom AwesomeServer Response object.  We do this to provide a more consistent, simplified response structure.

An AwesomeServer Response object is an instance of `AwesomeServer.AbstractResponse`. For HTTP response, the response object is also an instance of HTTPResponse, but that is not exposed to the developer.

The Response object has a number of convenience methods on it to help dealing with incoming requests.  However, if you need access to the original nodejs IncomingMessage object, you can simply use the `response.original` getter to obtain it.

Here's a quick rundown of the Response object members and methods.

**response.original** > [ServerResponse](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_serverresponse)

  Returns the wrapped ServerResponse received from the underlying server.  This allows you access to the "raw" response, if you so desire it.

**response.finished** > boolean

  Returns *true* if the response has been finished, which is caused by a call to `response.end()`.

**response.statusCode** > number

  Returns the number HTTP Status Code which was set by a prior call to `response.writeHead()`.

**response.contentType** > string

  Returns the `content-type` header if set by a call to `response.writeHead()`. This returns only the MIME-type portion of Content-Type. The charset or other parameters are removed.

**response.contentEncoding** > string

  Returns the charset portion of the `content-type` header. If no encoding was passed as part of the `content-type` header, this will return the assumed `utf-8` setting.

**response.pushSupported** > boolean

  Returns *true* if HTTP/2 push is supported by the response object. For HTTP responses, this will always return false.

**response.writeHead(statusCode,statusMessage,headers)** > void

  Used to initiate a response for the request.

  This is more or less a straight pass through to the [original method](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_response_writehead_statuscode_statusmessage_headers) in nodejs.

  - Argument: **statusCode**: optional, otherwise 200 is assumed. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **statusMessage**: optional

  - Argument: **headers**: optional

  - **Returns**: nothing

**response.write(data,encoding)** > Promise > nothing

  Used to send a chunk of response data for the request. This function returns a Promise that will resolve when the data is written to the outgoing stream.

  This is more or less a straight pass through to the [original method](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_response_write_chunk_encoding_callback) in nodejs.

  - Argument: **data* may be a Buffer or a string.

  - Argument: **encoding**: optional

  - **Returns**: Promise > void

**response.end(data,encoding)** > Promise > nothing

  Used to finish the process of writing response data for the request. This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).

  This is more or less a straight pass through to the [original method](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_response_write_chunk_encoding_callback) in nodejs.

  - Argument: **data* is an optional block of data to write before ending.

  - Argument: **encoding**: optional

  - **Returns**: Promise > void

**response.pipeFrom(readable)** > Promise > nothing

  Initiates a pipe from the given *readable* into the response outgoing stream.  This is similar to the underlying nodejs `response.pipe()` method, but you pass the readable into it, instead of the other way around in a normal pipe.

  - Argument: **readable* is a [nodejs Readable Stream](https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_readable) and required.

  - **Returns**: Promise > void

**response.writeText(statusCode,content,headers=null)** > Promise > nothing

  A shortcut method for returning content with the MIME-type of `text/plain`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`.

  - Argument: **statusCode* is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **content* is the Buffer or string content to write out.

  - Argument: **headers* is optional.

  This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).

  - **Returns**: Promise > void

**response.writeHTML(statusCode,content,headers=null)** > Promise > nothing

  A shortcut method for returning content with the MIME-type of `text/html`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`.

  - Argument: **statusCode* is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **content* is the Buffer or string content to write out.

  - Argument: **headers* is optional.

  This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).

  - **Returns**: Promise > void

**response.writeCSS(statusCode,content,headers=null)** > Promise > nothing

  A shortcut method for returning content with the MIME-type of `text/css`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`.

   - Argument: **statusCode* is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **content* is the Buffer or string content to write out.

  - Argument: **headers* is optional.

  This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).

  - **Returns**: Promise > void

**response.writeJSON(statusCode,content,headers=null)** > Promise > nothing

  A shortcut method for returning content with the MIME-type of `application/json`. This function will call `response.writeHead()` followed by `response.write()` followed by `response.end()`.

  - Argument: **statusCode* is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **content* is the Buffer or string content to write out.

  - Argument: **headers* is optional.

  This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).

  - **Returns**: Promise > void

**response.writeError(statusCode,content,headers=null)** > Promise > nothing

  A shortcut method for returning errors and error messages.

  - Argument: **statusCode* is required and should be a 400 or higher number. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **content* is the Buffer or string content to write out. Optionally, *content* can be a JavaScript Error object, and writeError will tease it into a more viewable plain text structure for outputting.

  - Argument: **headers* is optional.

  This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed).

  - **Returns**: Promise > void

**response.serve(statusCode,contentType,filename,headers=null)** > Promise > nothing

  A utility method for serving the contents of a given filename as the given `content-type`. This function will call `response.writeHead()`, open the given filename, pipe its content to the outgoing stream, and call `response.end()` when completed.

  - Argument: **statusCode* is optional and if ommitted will be assumed to be 200. See [Wikipedia HTTP Status Code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a basic overview.

  - Argument: **contentType* should be a valid MIME-type. If *contentType* is *null*, AwesomeServer will attempt to guess the MIME-type based on the filename, or will use `application/octet-stream` otherwise.

  - Argument: **filename* is the resolved filename to be served.

  - Argument: **headers* is optional.

  This function returns a Promise that will resolve when the data is written to the outgoing stream and the response is considered finsihed (but not necessarily closed). If the filename is not found or otherwise not readable, the Promise will reject with an exception.

  - **Returns**: Promise > void

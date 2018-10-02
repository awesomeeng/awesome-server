# [AwesomeServer](../README.md) > HTTP/2 Setup and Configuration

This document details how to work with HTTP/2 Servers in relation to AwesomeServer including configuration, request, and responses.

## Contents
 - [Inheritance](#inheritance)
 - [Compatability Mode](#compatability-mode)
 - [Usage](#usage)
 - [Configuring](#configuring-http-servers)
 - [Requests](#http-requests)
 - [Responses](#http-responses)

## Inheritance

The HTTP2Server detailed below extends [the HTTPSServer described already in our documentation](./Advanced_HTTPS.md) which in turn extends [the HTTPServer described already in our documentation](./Advanced_HTTP.md). Everything that is true for HTTPSServer and HTTPServer is true for HTTP2Server, and thus can be used in HTTP2Server.  (The inverse is not true, so things specific to HTTP2Server may not be available for HTTPSServer or HTTPServer.)

## Compatability Mode

AwesomeServer supports HTTP/2 connections using NodeJS's HTTP/2 Compatability Mode.  This makes HTTP/2 request and responses look and behave similar to HTTP/HTTPS requests and responses. Additionally, AwesomeServer provides some extra shortcut tools for HTTP/2 requests and responses to make working with HTTP/2 a little easier.

## Usage

To create an HTTP/2 Server for usage with AwesomeServer you use the `server.addHTTP2Server(config)` method and then `start()` AwesomeServer.  It takes a configuration option, as described below.

When a new request is received on the HTTP/2 Server, it takes the incoming request/response objects and wraps them in custom request/response objects.  The details of these wrapped request/response objects is below.

Note that it is entirely possible to have multiple calls to `server.addHTTP2Server(config)` which are listening on different ports with different configurations, but using the same underlying AwesomeServer for handling.

## Configuring HTTP/2 Servers

When calling `server.addHTTP2Server(config)` you may pass an optional configuration object.  This object has the shape described below, but is also fully compatable with the configuration object passed to **nodejs' `http2.createSecureServer()` function**, **nodejs' `server.listen(options)` function**, **nodejs' `https.createServer()` function**, **nodejs` `tls.createServer()` function**, and **nodejs' `tls.createSecureContext()` function.

Note that HTTP/2 does allow for insecure HTTP/2 connections, but in practice these are not recommended and thus not exposed by AwesomeServer.

The example below shows the default configuration object you would get if you did not pass anything to `server.addHTTPSServer()`.

```
let config = {
	host: "localhost",
	port: 7080,
	cert: null,
	key: null
};
```

**host**: [string] specifies the host interface to bind to. AwesomeServer sets this to "localhost" by default. To bind to all interfaces change this to "0.0.0.0".

**port**: [number] the interface port to bind to. For a random port, set to 0.

**cert**: [string|buffer] The `cert` option is required for an https server to be instantiated.  You may pass in a string or buffer that contains a PEM encoded certificate.  Optionally, you may pass in a valid existing filename that contains a PEM encoded certificate and AwesomeServer will load its contents for you.

**key**: [string|buffer] The `key` option is required for an https server to be instantiated.  You may pass in a string or buffer that contains a PEM encoded private key.  Optionally, you may pass in a valid existing filename that contains a PEM encoded private key and AwesomeServer will load its contents for you.

If you need greater fidelity of configuration, please see the following for more information on options:

 - [nodejs http2.createSecureServer() options](https://nodejs.org/dist/latest-v10.x/docs/api/http2.html#http2_http2_createsecureserver_options_onrequesthandler)
 - [nodejs net.server.listen() options](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback)
 - [nodejs https.createServer() options](https://nodejs.org/dist/latest-v10.x/docs/api/https.html#https_https_createserver_options_requestlistener)
 - [nodejs http.createServer() options](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_createserver_options_requestlistener)
 - [nodejs tls.createServer()](https://nodejs.org/dist/latest-v10.x/docs/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
 - [nodejs tls.createSecureContext()](https://nodejs.org/dist/latest-v10.x/docs/api/tls.html#tls_tls_createsecurecontext_options)

## HTTP/2 Requests

Each incoming request that is received by AwesomeServer has both a request and a response object. When the incoming request is received by the HTTP/2 server, its request object is wrapped in a custom AwesomeServer HTTP/2 Request object.  Likewise, its response object is wrapped in a custom AwesomeServer HTTP/2 Response object. We do this to provide a more consistent, simplified request structure.

An AwesomeServer HTTP/2 Request object is an instance of `AwesomeServer.http2.HTTPRequest` which is an instance of `AwesomeServer.https.HTTPRequest` which is itself an instance of `AwesomeServer.http.HTTPRequest` which in turn is an instance of `AwesomeServer.AbstractRequest`. if you need access to the original nodejs IncomingMessage object, you can simply use the `request.original` getter to obtain it.

Because the AwesomeServer HTTPSRequest extends AwesomeServer HTTPRequest, it has all the same members and methods.  Please refer to the [HTTPServer Guide Request Section](./Advanved_HTTP.md#http-request) for more information.

## HTTP/2 Responses

Each request that is received by AwesomeServer has both a request and a response object. When the request is received by the HTTP/2 server, the original response is wrapped in a custom AwesomeServer Response object.  We do this to provide a more consistent, simplified response structure.

An AwesomeServer Response object is an instance of `AwesomeServer.http2.HTTP2Response` which is an instance of `AwesomeServer.https.HTTPSResponse` which is itself an instance of `AwesomeServer.http.HTTPResponse` which is finally an instance of `AwesomeServer.AbstractResponse`.

Because the AwesomeServer HTTPSRequest extends AwesomeServer HTTPSResponse and HTTPResponse, it has all the same members and methods.  Please refer to the [HTTPServer Guide Response Section](./Advanved_HTTP.md#http-response) for more information.

Additionally, HTTP2Response has several more response members and methods worth noting:

**stream**: [ServerHTTP2Stream] Returns the underlying HTTP/2 stream of the request.

**serverRoot**: [string] Returns the relative server root for this incoming request. This allows the response to send back relative responses and have HTTP/2 understand where they reference.

**pushSupported**: [boolean] Returns true if a push operation may be done using this response.

**resolve(path)**: Resolves some path against the *serverRoot* for this request.
 - **path**: [string] The path to resolve.
 - returns **string**

**push(statusCode,path,contentType,content,headers={})**: Push the given content with the given details to the client.
 - **statusCode**: [number] The HTTP status code of the push.
 - **path**: [string] The path to push the content as.
 - **contentType**: [string] The content mime-type to push.
 - **content**: [string|Buffer] The content to push.
 - **headers**: [Object] Optional. Provide additional headers to the push.
 - returns **Promise > void**

**pushText(statusCode,path,content,header={})**: Shortcut method for pushing text/plain content.
- **statusCode**: [number] The HTTP status code of the push.
- **path**: [string] The path to push the content as.
- **content**: [string|Buffer] The content to push.
- **headers**: [Object] Optional. Provide additional headers to the push.
- returns **Promise > void**

**pushHTML(statusCode,path,content,header={})**: Shortcut method for pushing text/html content.
- **statusCode**: [number] The HTTP status code of the push.
- **path**: [string] The path to push the content as.
- **content**: [string|Buffer] The content to push.
- **headers**: [Object] Optional. Provide additional headers to the push.
- returns **Promise > void**

**pushCSS(statusCode,path,content,header={})**: Shortcut method for pushing text/css content.
- **statusCode**: [number] The HTTP status code of the push.
- **path**: [string] The path to push the content as.
- **content**: [string|Buffer] The content to push.
- **headers**: [Object] Optional. Provide additional headers to the push.
- returns **Promise > void**

**pushJSON(statusCode,path,content,header={})**: Shortcut method for pushing application/json content.
- **statusCode**: [number] The HTTP status code of the push.
- **path**: [string] The path to push the content as.
- **content**: [string|Buffer] The content to push.
- **headers**: [Object] Optional. Provide additional headers to the push.
- returns **Promise > void**

**pushServe(statusCode,path,contentType,filename,header={})** Shortcut method for pushing a given file to the stream as the given content type. The filename passed must exist at the time this method is called.
- **statusCode**: [number] The HTTP status code of the push.
- **path**: [string] The path to push the content as.
- **contentType**: [string] The content mime-type to push.
- **filename**: [string] The file to load and push.
- **headers**: [Object] Optional. Provide additional headers to the push.
- returns **Promise > void**

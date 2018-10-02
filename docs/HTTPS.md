# [AwesomeServer](../README.md) > HTTPS Setup and Configuration

This document details how to work with HTTPS Servers in relation to AwesomeServer including configuration, request, and responses.

## Contents
 - [Usage](#usage)
 - [Configuring](#configuring-http-servers)
 - [Requests](#http-requests)
 - [Responses](#http-responses)

## HTTPSServer extends HTTPServer

The HTTPSServer detailed below extends [the HTTPServer described already in our documentation](./Advanced_HTTP.md). Everything that is true for HTTPServer is true for HTTPSServer, and thus can be used in HTTPSServer.  (The inverse is not true, so things specific to HTTPSServer are may not be available for HTTPServer.)

## Usage

To create an HTTPS Server for usage with AwesomeServer you use the `server.addHTTPSServer(config)` method and then `start()` AwesomeServer.  It takes a configuration option, as described below.

When a new request is received on the HTTPS Server, it takes the incoming request/response objects and wraps them in custom request/response objects.  The details of these wrapped request/response objects is below.

Note that it is entirely possible to have multiple calls to `server.addHTTPSServer(config)` which are listening on different ports with different configurations, but using the same underlying AwesomeServer for handling.

## Configuring HTTPS Servers

When calling `server.addHTTPSServer(config)` you may pass an optional configuration object.  This object has the shape described below, but is also fully compatable with the configuration object passed to **nodejs' `http.createServer()` function**, **nodejs' `server.listen(options)` function**, **nodejs' `https.createServer()` function**, **nodejs` `tls.createServer()` function**, and **nodejs' `tls.createSecureContext()` function.

The example below shows the default configuration object you would get if you did not pass anything to `server.addHTTPSServer()`.

```
let config = {
	host: "localhost",
	port: 7080,
	cert: null,
	key: null
};
```

> **host**: [string] specifies the host interface to bind to. AwesomeServer sets this to "localhost" by default. To bind to all interfaces change this to "0.0.0.0".

> **port**: [number] the interface port to bind to. For a random port, set to 0.

> **cert**: [string|buffer] The `cert` option is required for an https server to be instantiated.  You may pass in a string or buffer that contains a PEM encoded certificate.  Optionally, you may pass in a valid existing filename that contains a PEM encoded certificate and AwesomeServer will load its contents for you.

> **key**: [string|buffer] The `key` option is required for an https server to be instantiated.  You may pass in a string or buffer that contains a PEM encoded private key.  Optionally, you may pass in a valid existing filename that contains a PEM encoded private key and AwesomeServer will load its contents for you.

If you need greater fidelity of configuration, please see the following for more information on options:

 - [nodejs http.createServer() options](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_createserver_options_requestlistener)
 - [nodejs net.server.listen() options](https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_server_listen_options_callback)
 - [nodejs https.createServer() options](https://nodejs.org/dist/latest-v10.x/docs/api/https.html#https_https_createserver_options_requestlistener)
 - [nodejs tls.createServer()](https://nodejs.org/dist/latest-v10.x/docs/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
 - [nodejs tls.createSecureContext()](https://nodejs.org/dist/latest-v10.x/docs/api/tls.html#tls_tls_createsecurecontext_options)

## HTTPS Requests

Each incoming request that is received by AwesomeServer has both a request and a response object. When the incoming request is received by the HTTPS server, its request object is wrapped in a custom AwesomeServer HTTPS Request object.  Likewise, its response object is wrapped in a custom AwesomeServer HTTPS Response object. We do this to provide a more consistent, simplified request structure.

An AwesomeServer HTTPS Request object is an instance of `AwesomeServer.https.HTTPRequest` which is itself an instance of `AwesomeServer.http.HTTPRequest` which in turn is an instance of `AwesomeServer.AbstractRequest`. if you need access to the original nodejs IncomingMessage object, you can simply use the `request.original` getter to obtain it.

Because the AwesomeServer HTTPSRequest extends AwesomeServer HTTPRequest, it has all the same members and methods.  Please refer to the [HTTPServer Guide Request Section](./Advanved_HTTP.md#http-request) for more information.

## HTTPS Responses

Each request that is received by AwesomeServer has both a request and a response object. When the request is received by the HTTPS server, the original response is wrapped in a custom AwesomeServer Response object.  We do this to provide a more consistent, simplified response structure.

An AwesomeServer Response object is an instance of `AwesomeServer.https.HTTPSResponse` which is itself an instance of `AwesomeServer.http.HTTPResponse` which is finally an instance of `AwesomeServer.AbstractResponse`.

Because the AwesomeServer HTTPSRequest extends AwesomeServer HTTPResponse, it has all the same members and methods.  Please refer to the [HTTPServer Guide Response Section](./Advanved_HTTP.md#http-response) for more information.

# [AwesomeServer](../README.md) > Requests

This document details requests and some of the things AwesomeServer does to save you time.

## Contents
 - [Inheritence](#inheritence)
 - [Accessing the Underlying Server Request Object](#accessing-the-underlying-server-request-object)
 - [Getting Method and URL Details](#getting-method-and-url-details)
 - [Getting Header Information](#getting-header-information)
 - [Reading Content](#reading-content)

## Inheritence

In AwesomeServer every request inherits from `AwesomeServer.AbstractRequest`. `AbstractRequest` requires each subclass to implement a series of members and methods which we detail in the next few sections. This structure allows us to ensure that the behaviors you need in order to use AwesomeServer are there for you.

While we are on the subject of inheritence, it is important to understand how `AbstractRequest` is extended by the various built in servers.  Here is a simple chart to help:

 - **HTTP**: HTTPRequest < AbstractRequest

 - **HTTPS**: HTTPSRequest < HTTPRequest < AbstractRequest

 - **HTTPS**: HTTPS2Request < HTTPSRequest < HTTPRequest < AbstractRequest

## Accessing the Underlying Server Request Object

HTTPRequest, HTTPSRequest and HTTP2Request all wrap nodejs' underlying `http.IncomingMessage` or `http2.Http2ServerRequest` classes.  Sometimes it is helpful to get at the underlying object.  `AbstractRequest` provides a means to do that.

> **request.original**: [IncomingMessage|Http2ServerRequest] - Returns the underlying request object.

## Getting Method and URL Details

`AbstractRequest` has a number of shortcuts for easily getting the Method and URL and URL portions.

> **request.method**: [string] - Returns the HTTP Method string, all uppercased.

> **request.url**: [URL] - Returns the request URL as a nodejs URL Object

> **request.path**: [string] - Returns the path portion of the request URL. Note that this is the actual entire path for the URL as opposed to the *path* argument your receive in your route functions which may have been reduced.

> **request.query**: [Object] - The parsed querystring object.

> **request.querystring**: [string] - The unparsed querystring string.

## Getting Header Information

`AbstractRequest` has a number of shortcuts for easily getting the useful request Header information.

> **request.headers**: [Object] - Returns the request headers object.

> **request.contentType**: [string] - Returns the mime-type portion of the `Content-Type` header, if any.

> **request.contentEncoding**: [string] - Returns the encoding portion of the `Content-Type` header, if any.

> **request.useragent**: [string] - Returns the `User-Agent` header, if any.

## Reading Content

For HTTP POST, PUT, and PATCH methods, additional content can be sent with the incoming request.  AwesomeServer naturally supplies an easy way to do this as well as two shortcut methods to make it even easier.

**read()** - Returns a Promise that resolves when the entire content is read from the request.
 - returns **Promise > Buffer **

> **readText** - Shortcut for `request.read()` but decodes the buffer into a text string of the given encoding.
 - **encoding** The encoding for decoding the string. Defaults to `utf-8`.
 - returns **Promise > string**

> **readText** - Shortcut for `request.read()` but decodes the buffer into a text string and then parses if via `JSON.parse()`.
 - **encoding** The encoding for decoding the string. Defaults to `utf-8`.
 - returns **Promise > Object**

# [AwesomeServer](../README.md) > Responses

This document details requests and some of the things AwesomeServer does to save you time.

## Contents
 - [Inheritence](#inheritence)
 - [Accessing the Underlying Server Response Object](#accessing-the-underlying-server-response-object)
 - [Getting Response State](#getting-response-state)
 - [Getting Response Header Information](#getting-response-header-information)
 - [Writing Content](#Writing-content)

## Inheritence

In AwesomeServer every response inherits from `AwesomeServer.AbstractResponse`. `AbstractResponse` requires each subclass to implement a series of members and methods which we detail in the next few sections. This structure allows us to ensure that the behaviors you need in order to use AwesomeServer are there for you.

While we are on the subject of inheritence, it is important to understand how `AbstractResponse` is extended by the various built in servers.  Here is a simple chart to help:

 - **HTTP**: HTTPResponse < AbstractResponse

 - **HTTPS**: HTTPSResponse < HTTPResponse < AbstractResponse

 - **HTTPS**: HTTPS2Response < HTTPSResponse < HTTPResponse < AbstractResponse

## Accessing the Underlying Server Response Object

HTTPResponse, HTTPSResponse and HTTP2Response all wrap nodejs' underlying `http.ServerResponse` or `http2.Http2ServerResponse` classes.  Sometimes it is helpful to get at the underlying object.  `AbstractResponse` provides a means to do that.

> **response.original**: [ServerResponse|Http2ServerResponse] - Returns the underlying response object.

## Getting Response State

`AbstractResponse` has a number of shortcuts for easily getting the current response state.

> **response.statusCode**: [number] - Returns the status code for this response, if set via `response.writeHead()`.  Returns null if the statusCode has not been set yet.

> **response.finished**: [boolean] - Returns true if the underlying object has been closed via `response.end()`. This signals that no more content can be written to the response.  This will also signal AwesomeServer to stop processing routes in multiple routing situations.

> **response.pushSupported**: [boolean] - Returns true if the underlying server support push behaviors (ala HTTP/2). Both HTTP and HTTPS return false.

## Getting Response Header Information

`AbstractResponse` has a number of shortcuts for easily getting the useful response Header information.

> **request.contentType**: [string] - Returns the mime-type portion of the `Content-Type` header, if any has been set yet.

> **request.contentEncoding**: [string] - Returns the encoding portion of the `Content-Type` header, if any has been set yet.

## Writing Content

AwesomeServer exposes the standard nodejs methods for writing content `writeHead()`, `write()`, and `end()`.  Additionally, AwesomeServer provides a collection of useful shortcut methods for making it even easier to write content.

> **writeHead(statusCode)**<br/>
> **writeHead(statusCode,headers)**<br/>
> **writeHead(statusCode,statusMessage,headers)**<br/>
> Used to set the status code, status message (very optional), and the headers.  The statusCode argument is the only required argument.
 - **statusCode**: [number] The HTTP Status Code to send for this response.
 - **statusMessage**: [string] A status message to send for this response. Very optional.
 - **headers**: [null|Object] An object of headers, if any, to send for this response.
 - returns **Promise > void **

> **write(chunk,encoding="utf-8")** - Write a chunk of data to the response. You can call this multiple times, so long as you dont call `response.end()`.
 - **chunk**: [*] The data to be written.
 - **encoding**: [string] The content encoding to be used for string content.
 - returns **Promise > void**

> **end(chunk,encoding="utf-8")** - Called to signal the end of writing and flag the response as finished. If *data* is included, this calls `response.write(data,encoding)` first, then ends.
 - **chunk**: [*] The data to be written.
 - **encoding**: [string] The content encoding to be used for string content.
 - returns **Promise > void**

> **pipeFrom(readable)** - Pipes the contents from the given readable stream into the response. This is kind of backward from how streams normally work, but due to the structure of AwesoneServer, that's how its got to be.
 - **readable**: [Readable] A readable stream.
 - returns **Promise > void**

> **writeText(statusCode,content,headers=null)**<br/>
> **writeText(content,headers=null)**<br/>
> Shortcut method for writing text/plain content to the response. Calling this method will also call `response.end()` and thus flags the response as finished.
 - **statusCode**: [number] The HTTP status code for this response.
 - **content**: [string] The content to be written.
 - **headers**: [null|Object] Headers for the response, if needed.
 - returns **Promise > void**

> **writeHTML(statusCode,content,headers=null)**<br/>
> **writeHTML(content,headers=null)**<br/>
> Shortcut method for writing text/html content to the response. Calling this method will also call `response.end()` and thus flags the response as finished.
 - **statusCode**: [number] The HTTP status code for this response.
 - **content**: [string] The content to be written.
 - **headers**: [null|Object] Headers for the response, if needed.
 - returns **Promise > void**

> **writeCSS(statusCode,content,headers=null)**<br/>
> **writeCSS(content,headers=null)**<br/>
> Shortcut method for writing text/css content to the response. Calling this method will also call `response.end()` and thus flags the response as finished.
 - **statusCode**: [number] The HTTP status code for this response.
 - **content**: [string] The content to be written.
 - **headers**: [null|Object] Headers for the response, if needed.
 - returns **Promise > void**

> **writeJSON(statusCode,content,headers=null)**<br/>
> **writeJSON(content,headers=null)**<br/>
> Shortcut method for writing application/json content to the response. If the *content* argument is a string it is assumed to be JSON already and sent to the response; anything else is first converted to json with `JSON.stringify()` and then sent to the response. Calling this method will also call `response.end()` and thus flags the response as finished.
 - **statusCode**: [number] The HTTP status code for this response.
 - **content**: [string|*] The content to be written.
 - **headers**: [null|Object] Headers for the response, if needed.
 - returns **Promise > void**

> **writeError(statusCode,content,headers=null)**<br/>
> **writeError(content,headers=null)**<br/>
> Shortcut method for writing an error message as text/plain content to the response. If the *content* argument is an Error class, the message and stack trace are converted to a readable string; otherwise, the content is sent as is. Calling this method will also call `response.end()` and thus flags the response as finished.
 - **statusCode**: [number] The HTTP status code for this response.
 - **content**: [string] The content to be written.
 - **headers**: [null|Object] Headers for the response, if needed.
 - returns **Promise > void**

> **serve(statusCode,contentType,filename,headers=null)**<br/>
> **serve(statusCode,filename,headers=null)**<br/>
> Shortcut method for serving a given filename from the file system into the response.  Calling this method will also call `response.end()` and thus flags the response as finished.
 - **statusCode**: [number] The HTTP status code for this response.
 - **contentType**: [string] The contentType to be written. Optional. If this is ommitted, AwesomeServer will attempt to guess the contentType from the file extension.
 - **filename**: [string] The content to be written.
 - **headers**: [null|Object] Headers for the response, if needed.
 - returns **Promise > void**

## Classes

<dl>
<dt><a href="#AbstractController">AbstractController</a></dt>
<dd><p>Defines an AbstractController. For more information on controllers, please
see our Controller documentation:</p>
</dd>
<dt><a href="#AbstractPathMatcher">AbstractPathMatcher</a></dt>
<dd><p>Describes the required shape of a PathMatcher used by AwesomeServer
for determining if an incoming request path matches a specific router.</p>
<p>The following functions are required to be implemented by
extending classes:</p>
<pre><code>    match()
    subtract()
    toString()</code></pre></dd>
<dt><a href="#AbstractRequest">AbstractRequest</a></dt>
<dd><p>Describes the required shape of all request objects passed to AwesomeServer
by an AbstractServer.</p>
<p>The following functions are required to be implemented by
extending classes:</p>
<pre><code>    get origin()
    get method()
    get url()
    get path()
    get query()
    get querystring()
    get headers()
    get contentType()
    get contentEncoding()
    get useragent()
    read()</code></pre><p>Provides the convenience methods:</p>
<pre><code>    readText()
    readJSON()</code></pre></dd>
<dt><a href="#AbstractResponse">AbstractResponse</a></dt>
<dd><p>Describes the required shape of all response objects passed to AwesomeServer
by an AbstractServer.</p>
<p>The following functions are required to be implemented by
extending classes:</p>
<pre><code>    get original()
    get finished()
    get statusCode()
    get contentType()
    get contentEncoding()
    get pushSupported()
    writeHead()
    write()
    end()
    pipeFrom()</code></pre><p>Provides the convenience methods:</p>
<pre><code>    writeText()
    writeHTML()
    writeCSS()
    writeJSON()
    writeError()
    serve()</code></pre></dd>
<dt><a href="#AbstractServer">AbstractServer</a></dt>
<dd><p>Describes the required shape of a server used by AwesomeServer.</p>
<p>The following functions are required to be implemented by
extending classes:</p>
<pre><code>    get running()
    get original()
    start()
    stop()</code></pre></dd>
<dt><a href="#AwesomeServer">AwesomeServer</a></dt>
<dd><p>AwesomeServer is a customizable API Server framework for enterprise nodejs
applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
provide flexible routing and controllers for responding to incoming requests in a
consistent, repeatable fashion.</p>
<p>Please see the documentation at @link <a href="https://github.com/awesomeeng/AwesomeServer">https://github.com/awesomeeng/AwesomeServer</a>.</p>
</dd>
</dl>

<a name="AbstractController"></a>

## AbstractController
Defines an AbstractController. For more information on controllers, please
see our Controller documentation:

**Kind**: global class  

* [AbstractController](#AbstractController)
    * [new AbstractController()](#new_AbstractController_new)
    * [.before()](#AbstractController+before) ⇒ <code>Promise</code> \| <code>void</code>
    * [.after()](#AbstractController+after) ⇒ <code>Promise</code> \| <code>void</code>
    * [.any()](#AbstractController+any) ⇒ <code>Promise</code> \| <code>void</code>
    * [.handler(path, request, response)](#AbstractController+handler) ⇒ <code>Promise</code>


* * *

<a name="new_AbstractController_new"></a>

### new AbstractController()
Constructor.


* * *

<a name="AbstractController+before"></a>

### abstractController.before() ⇒ <code>Promise</code> \| <code>void</code>
Executed before each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before moving the the handler function.  

* * *

<a name="AbstractController+after"></a>

### abstractController.after() ⇒ <code>Promise</code> \| <code>void</code>
Executed after each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+any"></a>

### abstractController.any() ⇒ <code>Promise</code> \| <code>void</code>
Executed only if a request method is not implemented in the controller. Can be used
as a kind of catch-all for requests.

**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+handler"></a>

### abstractController.handler(path, request, response) ⇒ <code>Promise</code>
The handler function which is executed for each request entering this controller.
The handler function takes care of caling before(), any matching request handler
for a given request method, and after(). If no matching request handler is
found, before(), any(), and after(), are called.

For any given request that is handled by this controller, the handler function
will attempt to find an appropriate handle function for a given request method.
It does so by looking for an all lowercase version of the method, or an all
uppsercase version of the method, or a
"handle<UpperCaseFirstCharacter><LowerCaseRemaining>" method. So for a GET
method it would try, in the following order...

		get()
		GET()
		handleGet()

The first matching function wins.

The handling function will be called with the signature

		(path,request,response)

For example,

		get(path,request,response)

The handling function may return a promise. If it does so, this
handle function will await for the promise to resolve.

Generally speaking, it is probably best not to overload this function but
to use before(), after(), any(), or the specific request method handler.

**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  
**Returns**: <code>Promise</code> - Returns a Promise that resolves when the request has been handled.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The remaining path string, after the matching route portion is removed. |
| request | [<code>AbstractRequest</code>](#AbstractRequest) | The request object. |
| response | [<code>AbstractResponse</code>](#AbstractResponse) | The response object. |


* * *

<a name="AbstractPathMatcher"></a>

## AbstractPathMatcher
Describes the required shape of a PathMatcher used by AwesomeServer
for determining if an incoming request path matches a specific router.

The following functions are required to be implemented by
extending classes:

		match()
		subtract()
		toString()

**Kind**: global class  

* [AbstractPathMatcher](#AbstractPathMatcher)
    * [new AbstractPathMatcher()](#new_AbstractPathMatcher_new)
    * _instance_
        * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
        * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
        * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>
    * _static_
        * [.getMatcher(path)](#AbstractPathMatcher.getMatcher) ⇒ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)


* * *

<a name="new_AbstractPathMatcher_new"></a>

### new AbstractPathMatcher()
Constructor.


* * *

<a name="AbstractPathMatcher+toString"></a>

### abstractPathMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* * *

<a name="AbstractPathMatcher+match"></a>

### abstractPathMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### abstractPathMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* * *

<a name="AbstractPathMatcher.getMatcher"></a>

### AbstractPathMatcher.getMatcher(path) ⇒ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Used by AwesomeServer to return an instance of the correct PathMatcher based
on the path argument passed in. This is used extensively in routing.

**Kind**: static method of [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

| Param | Type |
| --- | --- |
| path | <code>string</code> \| <code>RegExp</code> \| [<code>AbstractPathMatcher</code>](#AbstractPathMatcher) | 


* * *

<a name="AbstractRequest"></a>

## AbstractRequest
Describes the required shape of all request objects passed to AwesomeServer
by an AbstractServer.

The following functions are required to be implemented by
extending classes:

		get origin()
		get method()
		get url()
		get path()
		get query()
		get querystring()
		get headers()
		get contentType()
		get contentEncoding()
		get useragent()
		read()

Provides the convenience methods:

		readText()
		readJSON()

**Kind**: global class  

* [AbstractRequest](#AbstractRequest)
    * [new AbstractRequest(originalRequest)](#new_AbstractRequest_new)
    * [.original](#AbstractRequest+original) ⇒ <code>\*</code>
    * [.origin](#AbstractRequest+origin) ⇒ <code>string</code>
    * [.method](#AbstractRequest+method) ⇒ <code>string</code>
    * [.url](#AbstractRequest+url) ⇒ <code>URL</code>
    * [.path](#AbstractRequest+path) ⇒ <code>string</code>
    * [.query](#AbstractRequest+query) ⇒ <code>Object</code>
    * [.querystring](#AbstractRequest+querystring) ⇒ <code>string</code>
    * [.headers](#AbstractRequest+headers) ⇒ <code>Object</code>
    * [.contentType](#AbstractRequest+contentType) ⇒ <code>string</code>
    * [.contentEncoding](#AbstractRequest+contentEncoding) ⇒ <code>string</code>
    * [.useragent](#AbstractRequest+useragent) ⇒ <code>string</code>
    * [.read()](#AbstractRequest+read) ⇒ <code>type</code>
    * [.positional(pattern, path)](#AbstractRequest+positional) ⇒ <code>null</code> \| <code>Object</code>
    * [.readText([encoding])](#AbstractRequest+readText) ⇒ <code>Promise</code>
    * [.readJSON([encoding])](#AbstractRequest+readJSON) ⇒ <code>Promise</code>


* * *

<a name="new_AbstractRequest_new"></a>

### new AbstractRequest(originalRequest)
Creates an AbstractRequest which wraps an originalRequest object.


| Param | Type |
| --- | --- |
| originalRequest | <code>\*</code> | 


* * *

<a name="AbstractRequest+original"></a>

### abstractRequest.original ⇒ <code>\*</code>
Returns the original, underlying request object, whatever that might be.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+origin"></a>

### abstractRequest.origin ⇒ <code>string</code>
Returns the origin, as a string, of where the request is coming from, if that
information makes sense and is possible to return. Returns an empty string otherwise.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+method"></a>

### abstractRequest.method ⇒ <code>string</code>
Returns the HTTP Method for this request. This must be
an all upper case string.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+url"></a>

### abstractRequest.url ⇒ <code>URL</code>
Returns the URL (as a nodejs URL object) of this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+path"></a>

### abstractRequest.path ⇒ <code>string</code>
Returns the path, usually taken from the url, of this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+query"></a>

### abstractRequest.query ⇒ <code>Object</code>
Returns the query/search portion of te url as a fully parsed query
object (usualy via nodejs querystring) of this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+querystring"></a>

### abstractRequest.querystring ⇒ <code>string</code>
Returns the query/search portion of the url as a string.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+headers"></a>

### abstractRequest.headers ⇒ <code>Object</code>
Returns the headers for this request as a parsed object. All header
keys must be lowercased.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+contentType"></a>

### abstractRequest.contentType ⇒ <code>string</code>
Returns the mime-type portion of the content-type of this request,
usually from the haders.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+contentEncoding"></a>

### abstractRequest.contentEncoding ⇒ <code>string</code>
Returns the charset (content encoding) portion of the content-type
of this request, usually from the headers.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+useragent"></a>

### abstractRequest.useragent ⇒ <code>string</code>
Returns the user-agent string for this request, usually from the headers.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+read"></a>

### abstractRequest.read() ⇒ <code>type</code>
Returns a Promise that resolves with a Buffer that contains the
entire body content of the request, if any, or null if not.

This must resolve with null or a Buffer. Do not resolve with a string.

**Kind**: instance method of [<code>AbstractRequest</code>](#AbstractRequest)  

* * *

<a name="AbstractRequest+positional"></a>

### abstractRequest.positional(pattern, path) ⇒ <code>null</code> \| <code>Object</code>
Given some pattern, return the matching positional parameters
from the path.  If path is supplied as an argument, use that. If
path is not supplied, use the current url path.

Pattern uses the standard format used by most nodejs REST
frameworks:

		/test/:id/:value

Where any name that starts with a colon is a positional
parameter.  Names must use only the A-Z, a-z, 0-9, or _
characters.

The pattern must be an exact match.

If the pattern does not match, null is returned.

**Kind**: instance method of [<code>AbstractRequest</code>](#AbstractRequest)  

| Param | Type |
| --- | --- |
| pattern | <code>string</code> | 
| path | <code>undefined</code> \| <code>null</code> \| <code>string</code> | 


* * *

<a name="AbstractRequest+readText"></a>

### abstractRequest.readText([encoding]) ⇒ <code>Promise</code>
Conveience method to read the body content of the request as
as plain text string using the given encoding (or utf-8 if
no encoding is given).

Returns a Promise that will resolve when the content is read
as a string.

**Kind**: instance method of [<code>AbstractRequest</code>](#AbstractRequest)  

| Param | Type | Default |
| --- | --- | --- |
| [encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | 


* * *

<a name="AbstractRequest+readJSON"></a>

### abstractRequest.readJSON([encoding]) ⇒ <code>Promise</code>
Convenience method to read the body content of the request as
a text string using the given encoding (or utf-8 if no encoding is given)
and then parse it as json.

Returns a Promise that will resolve when the content is read as a
string and then parsed as json. Will reject if the parse fails.

**Kind**: instance method of [<code>AbstractRequest</code>](#AbstractRequest)  

| Param | Type | Default |
| --- | --- | --- |
| [encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | 


* * *

<a name="AbstractResponse"></a>

## AbstractResponse
Describes the required shape of all response objects passed to AwesomeServer
by an AbstractServer.

The following functions are required to be implemented by
extending classes:

		get original()
		get finished()
		get statusCode()
		get contentType()
		get contentEncoding()
		get pushSupported()
		writeHead()
		write()
		end()
		pipeFrom()

Provides the convenience methods:

		writeText()
		writeHTML()
		writeCSS()
		writeJSON()
		writeError()
		serve()

**Kind**: global class  

* [AbstractResponse](#AbstractResponse)
    * [new AbstractResponse(originalResponse)](#new_AbstractResponse_new)
    * [.original](#AbstractResponse+original) ⇒ <code>\*</code>
    * [.finished](#AbstractResponse+finished) ⇒ <code>boolean</code>
    * [.statusCode](#AbstractResponse+statusCode) ⇒ <code>number</code>
    * [.contentType](#AbstractResponse+contentType) ⇒ <code>string</code>
    * [.contentEncoding](#AbstractResponse+contentEncoding) ⇒ <code>string</code>
    * [.pushSupported](#AbstractResponse+pushSupported) ⇒ <code>boolean</code>
    * [.setHeader(name, value)](#AbstractResponse+setHeader)
    * [.writeHead(statusCode, statusMessage, headers)](#AbstractResponse+writeHead)
    * [.write(data, encoding)](#AbstractResponse+write) ⇒ <code>Promise</code>
    * [.end(data, encoding)](#AbstractResponse+end) ⇒ <code>Promise</code>
    * [.pipeFrom()](#AbstractResponse+pipeFrom) ⇒ <code>Promise</code>
    * [.writeJSON(statusCode, content, [headers])](#AbstractResponse+writeJSON) ⇒ <code>Promise</code>
    * [.writeText(statusCode, content, [headers])](#AbstractResponse+writeText) ⇒ <code>Promise</code>
    * [.writeCSS(statusCode, content, [headers])](#AbstractResponse+writeCSS) ⇒ <code>Promise</code>
    * [.writeHTML(statusCode, content, [headers])](#AbstractResponse+writeHTML) ⇒ <code>Promise</code>
    * [.writeError(statusCode, content, [headers])](#AbstractResponse+writeError) ⇒ <code>Promise</code>
    * [.serve(statusCode, content, [headers])](#AbstractResponse+serve) ⇒ <code>Promise</code>


* * *

<a name="new_AbstractResponse_new"></a>

### new AbstractResponse(originalResponse)
Creates an AbstractResponse which wraps an originalResponse object.


| Param | Type |
| --- | --- |
| originalResponse | <code>\*</code> | 


* * *

<a name="AbstractResponse+original"></a>

### abstractResponse.original ⇒ <code>\*</code>
Returns the original, underlying response object, whatever that might be.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractResponse</code>](#AbstractResponse)  

* * *

<a name="AbstractResponse+finished"></a>

### abstractResponse.finished ⇒ <code>boolean</code>
Returns true if the end() method has been called and this request is
closed to further writes.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractResponse</code>](#AbstractResponse)  

* * *

<a name="AbstractResponse+statusCode"></a>

### abstractResponse.statusCode ⇒ <code>number</code>
Returns the response status code, if one has been set, for this
response.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractResponse</code>](#AbstractResponse)  

* * *

<a name="AbstractResponse+contentType"></a>

### abstractResponse.contentType ⇒ <code>string</code>
Returns the response mime-type portion of the content-type
header, if one has been set.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractResponse</code>](#AbstractResponse)  

* * *

<a name="AbstractResponse+contentEncoding"></a>

### abstractResponse.contentEncoding ⇒ <code>string</code>
Returns the response charset (encoding) portion of the content-type
header, if one has been set.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>AbstractResponse</code>](#AbstractResponse)  

* * *

<a name="AbstractResponse+pushSupported"></a>

### abstractResponse.pushSupported ⇒ <code>boolean</code>
True if push() and push...() functions are supported by this response
object. This is generally only true when the request supports bi-directional
flow, such as HTTP/2.

**Kind**: instance property of [<code>AbstractResponse</code>](#AbstractResponse)  
**Returns**: <code>boolean</code> - true if push() and push...() functions are supported.  

* * *

<a name="AbstractResponse+setHeader"></a>

### abstractResponse.setHeader(name, value)
Set a header for outgoing requests. Any header set via setHeader()
is merged with any headers set by writeHead() before the final response
is sent.

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>string</code> | 


* * *

<a name="AbstractResponse+writeHead"></a>

### abstractResponse.writeHead(statusCode, statusMessage, headers)
Sets the status code and headers for the response. This may only be
called once per request and cannot be called after a write() or
and end() has been called.

Unlike write() and end() this does not return a Promise and does
not need to be preceeded by an await.

THe headers parameter should have the header keys as lower case.

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> |  |
| statusMessage | <code>string</code> \| <code>null</code> | optional. |
| headers | <code>Object</code> | optional. |


* * *

<a name="AbstractResponse+write"></a>

### abstractResponse.write(data, encoding) ⇒ <code>Promise</code>
Writes a chunk of data to the response with the given encoding.

Returns a Promise that will resolve when the write is complete.
It is always good practice to await a write().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> \| <code>string</code> |  |
| encoding | <code>string</code> | optional. Defaults to utf-8. |


* * *

<a name="AbstractResponse+end"></a>

### abstractResponse.end(data, encoding) ⇒ <code>Promise</code>
Writes the passed in data to the response with the given encoding
and then marks the response finished.

Returns a Promise that will resolve when the end is complete.
It is always good practice to await an end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> \| <code>string</code> |  |
| encoding | <code>string</code> | optional. Defaults to utf-8. |


* * *

<a name="AbstractResponse+pipeFrom"></a>

### abstractResponse.pipeFrom() ⇒ <code>Promise</code>
Pipes the given Readable stream into the response object. writeHead()
should be called prior to this.

When the pipeFrom() is complete, end() is called and the response
is marked finished.

It is worth noting that pipeFrom() is different from nodejs Stream
pipe() method in that pipe() takes as an argument the writable stream.
pipeFrom() flips that and takes as an argument the readable stream.

Returns a Promise that will resolve when the end of the stream has
been sent and end() has been called. It is always good practice to
await pipeFrom().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

* * *

<a name="AbstractResponse+writeJSON"></a>

### abstractResponse.writeJSON(statusCode, content, [headers]) ⇒ <code>Promise</code>
A convenience method for writing a JSON string or object converted to
JSON to the response. This method will perform the writeHead(), the
write(), and the end() all in one.

If the passed in content is a string, it is assumed to be JSON. Any
thing else passed in will be converted to json (via JSON.stringify())
and then sent.

Returns a Promise that will resolve on end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| content | <code>\*</code> \| <code>string</code> |  | 
| [headers] | <code>Object</code> \| <code>null</code> | <code></code> | 


* * *

<a name="AbstractResponse+writeText"></a>

### abstractResponse.writeText(statusCode, content, [headers]) ⇒ <code>Promise</code>
A convenience method for writing plain text to the response with the
content-type "text/plain".
This method will perform the writeHead(), the write(), and the end()
all in one.

Returns a Promise that will resolve on end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| content | <code>string</code> |  | 
| [headers] | <code>Object</code> \| <code>null</code> | <code></code> | 


* * *

<a name="AbstractResponse+writeCSS"></a>

### abstractResponse.writeCSS(statusCode, content, [headers]) ⇒ <code>Promise</code>
A convenience method for writing CSS to the response with the content-type
"text/css".
This method will perform the writeHead(), the write(), and the end()
all in one.

Returns a Promise that will resolve on end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| content | <code>string</code> |  | 
| [headers] | <code>Object</code> \| <code>null</code> | <code></code> | 


* * *

<a name="AbstractResponse+writeHTML"></a>

### abstractResponse.writeHTML(statusCode, content, [headers]) ⇒ <code>Promise</code>
A convenience method for writing HTML to the response with the
content-type "text/html".
This method will perform the writeHead(), the write(), and the end()
all in one.

Returns a Promise that will resolve on end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| content | <code>string</code> |  | 
| [headers] | <code>Object</code> \| <code>null</code> | <code></code> | 


* * *

<a name="AbstractResponse+writeError"></a>

### abstractResponse.writeError(statusCode, content, [headers]) ⇒ <code>Promise</code>
A convenience method for writing and error message to the response.
The content-type for this is "text/plain".
This method will perform the writeHead(), the write(), and the end()
all in one.

If the content argument is an instance of Error, this method will
format the text from the Error.message and Error.stack members.

Returns a Promise that will resolve on end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| content | <code>string</code> \| <code>Error</code> | <code>null</code> | 
| [headers] | <code>Object</code> \| <code>null</code> | <code></code> | 


* * *

<a name="AbstractResponse+serve"></a>

### abstractResponse.serve(statusCode, content, [headers]) ⇒ <code>Promise</code>
A convenience method for serving a specific file as the response. You
supply the filename and this method will take care of the rest. The
filename given must be valid file path and must exist or an error
will be thrown.  This function will not resolve relative filenames
the way that AwesomeServer will, so its best to use
AwesomeServer.resolve() first yourself.
This method will perform the writeHead(), the write(), and the end()
all in one.

Returns a Promise that will resolve on end().

**Kind**: instance method of [<code>AbstractResponse</code>](#AbstractResponse)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| content | <code>string</code> |  | 
| [headers] | <code>Object</code> \| <code>null</code> | <code></code> | 


* * *

<a name="AbstractServer"></a>

## AbstractServer
Describes the required shape of a server used by AwesomeServer.

The following functions are required to be implemented by
extending classes:

		get running()
		get original()
		start()
		stop()

**Kind**: global class  

* [AbstractServer](#AbstractServer)
    * [new AbstractServer(config)](#new_AbstractServer_new)
    * [.config](#AbstractServer+config) ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
    * [.running](#AbstractServer+running) ⇒ <code>boolean</code>
    * [.original](#AbstractServer+original) ⇒ <code>\*</code>
    * [.hostname](#AbstractServer+hostname) ⇒ <code>string</code>
    * [.port](#AbstractServer+port) ⇒ <code>number</code>
    * [.start(handler)](#AbstractServer+start) ⇒ <code>Promise</code>
    * [.stop()](#AbstractServer+stop) ⇒ <code>Promise</code>


* * *

<a name="new_AbstractServer_new"></a>

### new AbstractServer(config)
Constructor. Takes a single config object which is in turn usually passed
on to the underlying server that this AbstractServer represents.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | The config object. |


* * *

<a name="AbstractServer+config"></a>

### abstractServer.config ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
Returns the passed in config object.

**Kind**: instance property of [<code>AbstractServer</code>](#AbstractServer)  

* * *

<a name="AbstractServer+running"></a>

### abstractServer.running ⇒ <code>boolean</code>
Returns true if this server has been started.

**Kind**: instance property of [<code>AbstractServer</code>](#AbstractServer)  

* * *

<a name="AbstractServer+original"></a>

### abstractServer.original ⇒ <code>\*</code>
Returns the underlying server object that this AbstractServer represents.

**Kind**: instance property of [<code>AbstractServer</code>](#AbstractServer)  

* * *

<a name="AbstractServer+hostname"></a>

### abstractServer.hostname ⇒ <code>string</code>
Returns the bound hostname for this server.

**Kind**: instance property of [<code>AbstractServer</code>](#AbstractServer)  

* * *

<a name="AbstractServer+port"></a>

### abstractServer.port ⇒ <code>number</code>
Returns the bound port for this server.

**Kind**: instance property of [<code>AbstractServer</code>](#AbstractServer)  

* * *

<a name="AbstractServer+start"></a>

### abstractServer.start(handler) ⇒ <code>Promise</code>
Start this server running and being sending incoming requests to the given handler.

This start function gets a single argument, the handler function that incoming
requests should be sent to.  It is the job of this server to take the
incoming requests, wrap the request object in an AbstractRequest subclass,
wrap the response object in an AbstractResponse subclass, and then send both
of those to the handler for processing.

Here's an example from HTTPServer:

		server.on("request",(request,response)=>{
			request = new HTTPRequest(request);
			response = new HTTPResponse(response);
			handler(request,response);
		});

Start must return a Promise that resolves when the underlying server is started
or rejects on an error.

It is the responsibility of the AbstractServer implementor to keep track of the
underlying server object.

**Kind**: instance method of [<code>AbstractServer</code>](#AbstractServer)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="AbstractServer+stop"></a>

### abstractServer.stop() ⇒ <code>Promise</code>
Stop this server running and stop sending incoming requests to AwesomeServer.

Stop must return a Promise that resolves when the underlying server is stopped
or rejects on an error.

**Kind**: instance method of [<code>AbstractServer</code>](#AbstractServer)  

* * *

<a name="AwesomeServer"></a>

## AwesomeServer
AwesomeServer is a customizable API Server framework for enterprise nodejs
applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
provide flexible routing and controllers for responding to incoming requests in a
consistent, repeatable fashion.

Please see the documentation at @link https://github.com/awesomeeng/AwesomeServer.

**Kind**: global class  

* [AwesomeServer](#AwesomeServer)
    * [new AwesomeServer()](#new_AwesomeServer_new)
    * _instance_
        * [.config](#AwesomeServer+config) ⇒ <code>object</code>
        * [.servers](#AwesomeServer+servers) ⇒ [<code>Array.&lt;AbstractServer&gt;</code>](#AbstractServer)
        * [.routes](#AwesomeServer+routes) ⇒ <code>Array.&lt;string&gt;</code>
        * [.running](#AwesomeServer+running) ⇒ <code>boolean</code>
        * [.start()](#AwesomeServer+start) ⇒ <code>Promise</code>
        * [.stop()](#AwesomeServer+stop) ⇒ <code>Promise</code>
        * [.addServer(server)](#AwesomeServer+addServer) ⇒ [<code>AbstractServer</code>](#AbstractServer)
        * [.addHTTPServer(config)](#AwesomeServer+addHTTPServer) ⇒ [<code>AbstractServer</code>](#AbstractServer)
        * [.addHTTPSServer(config)](#AwesomeServer+addHTTPSServer) ⇒ [<code>AbstractServer</code>](#AbstractServer)
        * [.addHTTP2Server(config)](#AwesomeServer+addHTTP2Server) ⇒ [<code>AbstractServer</code>](#AbstractServer)
        * [.removeServer(server)](#AwesomeServer+removeServer) ⇒ <code>boolean</code>
        * [.route(method, path, handler)](#AwesomeServer+route)
        * [.unroute(method, path, handler)](#AwesomeServer+unroute) ⇒ <code>boolean</code>
        * [.removeAllRoutes()](#AwesomeServer+removeAllRoutes)
        * [.redirect(method, path, toPath, [temporary])](#AwesomeServer+redirect)
        * [.serve(path, contentType, filename)](#AwesomeServer+serve)
        * [.push(path, referencePath, contentType, filename)](#AwesomeServer+push)
        * [.resolve(filename)](#AwesomeServer+resolve) ⇒ <code>string</code> \| <code>null</code>
        * [.handler(response)](#AwesomeServer+handler) ⇒ <code>Promise</code>
    * _static_
        * [.AbstractServer](#AwesomeServer.AbstractServer) ⇒
        * [.AbstractRequest](#AwesomeServer.AbstractRequest) ⇒
        * [.AbstractResponse](#AwesomeServer.AbstractResponse) ⇒
        * [.AbstractController](#AwesomeServer.AbstractController) ⇒
        * [.AbstractPathMatcher](#AwesomeServer.AbstractPathMatcher)
        * [.http](#AwesomeServer.http)
        * [.https](#AwesomeServer.https)
        * [.http2](#AwesomeServer.http2)
        * [.controllers](#AwesomeServer.controllers)


* * *

<a name="new_AwesomeServer_new"></a>

### new AwesomeServer()
Creates a new AwesomeServer instance.

You may create multiple AwesomeServer instances and do different things with them.

Takes an optional config object for passing in configuration about the overall
AwesomeServer instance.  This is not the same as the config provided to each
server when it is constructed/added via addHTTPServer(config) and the like.
Those configs are separate.

The default configuration looks like this:

	 config = {
	 	informative: true
	 }

	 config.informative - If true, log statements are provided for how AwesomeServer
	 is executing. If false, no log statements are output. Error and warning
	 log message are always output.


* * *

<a name="AwesomeServer+config"></a>

### awesomeServer.config ⇒ <code>object</code>
Returns the AwesomeServer instance config.  This is not the same as the
config supplied to each server. Instead this config applies to the greater
AwesomeServer instance which is running the various servers.

**Kind**: instance property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+servers"></a>

### awesomeServer.servers ⇒ [<code>Array.&lt;AbstractServer&gt;</code>](#AbstractServer)
Returns the array of servers associated with this AwesomeServer instance.

**Kind**: instance property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+routes"></a>

### awesomeServer.routes ⇒ <code>Array.&lt;string&gt;</code>
Returns the array of routes as strings associated with this AwesomeServer instance.

**Kind**: instance property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+running"></a>

### awesomeServer.running ⇒ <code>boolean</code>
Returns true if this AwesomeServer is running (start() has been executed).

**Kind**: instance property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+start"></a>

### awesomeServer.start() ⇒ <code>Promise</code>
Starts the AwesomeServer instance, if not already running. This in turn will
start each added server and begin to route incoming requests.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+stop"></a>

### awesomeServer.stop() ⇒ <code>Promise</code>
Stops the AwesomeServer instance, if running. This in turn will
stop each added server and stop routing incoming requests.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+addServer"></a>

### awesomeServer.addServer(server) ⇒ [<code>AbstractServer</code>](#AbstractServer)
Adds a new server instance to the AwesomeServer. You may add multiple servers
to  single AwesomeServer and each server will be handled for incoming requests
and routed the same way.

Primarily this method is for adding custom servers. If you are using the default
HTTP, HTTPS, or HTTP/2 servers, use the addHTTPServer(), addHTTPSServer() or
addHTTP2Server() functions instead.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: [<code>AbstractServer</code>](#AbstractServer) - the server added.  

| Param | Type | Description |
| --- | --- | --- |
| server | [<code>AbstractServer</code>](#AbstractServer) | The server instance to add. Must be an extension of AbstractServer. |


* * *

<a name="AwesomeServer+addHTTPServer"></a>

### awesomeServer.addHTTPServer(config) ⇒ [<code>AbstractServer</code>](#AbstractServer)
Adds a new HTTP Server to the AwesomeServer instance. The HTTP Server is
a wrapped version of nodejs's *http* module and thus behaves as that
module behaves, with some slight differences.  Each request that comes
through will have its request and response objects wrapped in AwesomeServer's
custom HTTPRequest and HTTPResponse objects. The provide a simplified but
cleaner access layer to the underlying request or response. See AbstractRequest
and AbstractResponse for more details.

Takes a *config* object as an argument that is passed to the underlying HTTP
module.  The basic structure of this config is below with the default values shown:

```
const config = {
  hostname: "localhost"
  port: 7080,
  informative: {inherits from top level config}
};
```
For more details about config values, please see [nodejs' http module]()

**An important note about config**: The default *host* setting for AwesomeServer
is `localhost`. This is different than the default for the underlying
nodejs http module of `0.0.0.0`.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: [<code>AbstractServer</code>](#AbstractServer) - the server added.  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | An AwesomeConfig or plain Object. |


* * *

<a name="AwesomeServer+addHTTPSServer"></a>

### awesomeServer.addHTTPSServer(config) ⇒ [<code>AbstractServer</code>](#AbstractServer)
Adds a new HTTPS Server to the AwesomeServer instance. The HTTPS Server is
a wrapped version of nodejs's *https* module and thus behaves as that
module behaves, with some slight differences.  Each request that comes
through will have its request and response objects wrapped in AwesomeServer's
custom HTTPRequest and HTTPResponse objects. The provide a simplified but
cleaner access layer to the underlying request or response. See AbstractRequest
and AbstractResponse for more details.

Takes a *config* object as an argument that is passed to the underlying HTTPS
module.  The basic structure of this config is below with the default values shown:

```
const config = {
  hostname: "localhost"
  port: 7080,
  key: null,
  cert: null,
  pfx: null,
  informative: {inherits from top level config}
};
```

*key*, *cert*, and *pfx* are handled specially in AwesomeServer. You may supply
a string representing the certificate or a string representing a valid path
to a file containing the certificate. AwesomeServer will attempt to load
the file and if successful use that as the value.

For more details about config values, please see [nodejs' *https* module]()

**An important note about config**: The default *host* setting for AwesomeServer
is `localhost`. This is different than the default for the underlying
nodejs *https* module of `0.0.0.0`.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: [<code>AbstractServer</code>](#AbstractServer) - the server added.  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | An AwesomeConfig or plain Object. |


* * *

<a name="AwesomeServer+addHTTP2Server"></a>

### awesomeServer.addHTTP2Server(config) ⇒ [<code>AbstractServer</code>](#AbstractServer)
Adds a new HTTP/2 Server to the AwesomeServer instance. The HTTP/2 Server is
a wrapped version of nodejs's *http2* module and thus behaves as that
module behaves, with some slight differences.  Each request that comes
through will have its request and response objects wrapped in AwesomeServer's
custom HTTPRequest and HTTPResponse objects. The provide a simplified but
cleaner access layer to the underlying request or response. See AbstractRequest
and AbstractResponse for more details.

Takes a *config* object as an argument that is passed to the underlying HTTP/2
module.  The basic structure of this config is below with the default values shown:

```
const config = {
  hostname: "localhost"
  port: 7080,
  key: null,
  cert: null,
  pfx: null,
  informative: {inherits from top level config}
};
```

*key*, *cert*, and *pfx* are handled specially in AwesomeServer. You may supply
a string representing the certificate or a string representing a valid path
to a file containing the certificate. AwesomeServer will attempt to load
the file and if successful use that as the value.

For more details about config values, please see [nodejs' *http2* module]()

**An important note about config**: The default *host* setting for AwesomeServer
is `localhost`. This is different than the default for the underlying
nodejs *http2* module of `0.0.0.0`.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: [<code>AbstractServer</code>](#AbstractServer) - the server added.  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | An AwesomeConfig or plain Object. |


* * *

<a name="AwesomeServer+removeServer"></a>

### awesomeServer.removeServer(server) ⇒ <code>boolean</code>
Removes a given server from thise AwesomeServer instance. You obtain the server value
as a return value from `addServer()` or `addHTTPServer()` or `addHTTPSServer()` or
`addHTTP2Server()` or from the `servers` getter.

If the removed server is currently running, it will automatically be stopped as
part of its removal.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: <code>boolean</code> - true if the server was removed.  

| Param | Type | Description |
| --- | --- | --- |
| server | [<code>AbstractServer</code>](#AbstractServer) | The server to remove. |


* * *

<a name="AwesomeServer+route"></a>

### awesomeServer.route(method, path, handler)
Add a route for incoming requests. A route is defined as some handler that responds to
an incoming request. Routing is the backbone of AwesomeServer which takes an incoming
request from a server, matches zero or more routes against the request, and then
executes each matching route.

Routing is decribed in much more detail in our routing documentation:

route() has four different invocations that have slightly different meanings, depending on
the arguments passed into it.

	 route(method,path,handler) - The most basic form of routing, this will execute the given
	 handler Function if the method and path match for an incoming request. (see method and see
	 path below.)

  route(method,path,controller) - This will execute the given controller (see
  controllers below) if the method and path match for an incoming request. (see method and
  see path below).

  route(path,controller) - A synonym for calling route("*",path,controller).

  route(method,path,filename) - A synonym for calling route(method,path,controller)
  except the given filename is loaded an instantiated as a controller first. This lets you
  reference external controllers by filename easily.

method: The method argument is a string that identifies one of the well known HTTP Methods
or a wildcard character "*" to match all methods.  The HTTP Methods supported are GET, POST,
PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE, and PATCH.

path: The path argument may be either a string, a Regular Expression, or an instance of
AbstractPathMatcher. A path matches the path portion of the url; not including the
search/query or hash portions.

  string: Five different types of string paths can be defined:

		exact: A string that matches exactly the url path from the request. Exact path
		strings look like this: "/test" and do not contain any wildcard "*" or or "|"
		characters.

		startsWith: A string that matches the beginning portion of the url path from the
		request.  startsWith strings look like this: "/test*" and must end with a
		wildcard character "*" and may not contain an or "|" character.

		endsWith: A string that matches the ending portion of the url path from the
		request. endsWith strings look like this: "*test" and must begin with a
		wildcard character "*" and may not contain an or "|" character.

		contains: A string that matches if contained within some portion (including the
		beginning and ending) of the url path from the request.  contains strings look like
		this: "*test*" and must both begin with and end with the wildcard "*" character and
		may not contain an or "|" character.

		or: two or more path strings (from the above options) separated by an or "|"
		character where at least one of the or segments matches the url path from the
		request.  Or strings look like this: "/test|/test/*".

  RegExp: a regular expression that matches the url path from the request. RegExp
  paths look like this: /^\/test$/

  AbstractPathMatcher: You may provide your own implementation of AbstractPathMatcher
  to be used to determine if the url path of the request is a match. AbstractPathMatcher
  would need to be extended and the match(path), subtract(path) and toString() methods
  would need to be implemented.

handler: A handler function that will be executed when the incoming request method
and path matches.  The handler function has the following signature:

		handler(path,request,response)

			path: is the modified path of the incoming request. It has been modified, but
			removing the matching path out of it.  For example, if the incoming path is
			"/api/xyz" and the route path argument is "/api/*" this path argument would
			have "xyz" as its value; the "/api/" was removed out.

			request: An instance of AbstractRequest which wraps the underlying request
			object from the server. See AbstractRequest for more details.

			response: An instance of AbstractResponse which wraps the underlying response
			obect from the server. See AbstractResponse for more details.

controller: An instance of AbstractController that will be executed when the incoming
request method and path matches.  Controllers are a great way to strcuture your API
endpoints around url resources. For more information on controllers go here:

filename: A filename to a valid controller class JS file.  Using filenames has some
special intricacies to be aware of.

		resolving: The filename may be a resolved absolute path, or a relative path. In
		the case of relative paths, AwesomeServer will try to resolve the filename
		relative to itself, then relative to the module that called AwesomeServer,
		and finally relative to process.cwd().  The first resolved filename that
		exists is used.

		directories: If the filename resolves to a directory, AwesomeServer will
		attempt to use all .JS files in that directory or any sub-directory and
		route them to paths based ont their name and try structure.  For example,
		consider the directory tree:

			./files
				One.js
				Two.js
				Three.js
				Three
					One.js

		IF the call `route("*","/api","./files")` is made, this would end up routing
		the following:

			`route("*","/api/One","./files/One.js")`
			`route("*","/api/Two","./files/Two.js")`
			`route("*","/api/Three","./files/Three.js")`
			`route("*","/api/Three/One","./files/Three/One.js")`

		requirements: For a filename to be routed it must...

         - exist.
         - be a file or directory, no FIFO or pipes.
			- Be a valid .js or .node file.
			- Not contain any syntax errors.
			- export a class that extends AbstractController or exports an instance of a class that extends AbstractController.

		When using filename routing, you may provide additional arguments to the `route()`
		function and these will be passed to the controller constructor. This allows you
		to ensure critical data for the controller be passed upward as needed.

Routes may be added whether or not AwesomeServer has been started.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | see above. |
| path | <code>string</code> \| <code>RegExp</code> \| [<code>AbstractPathMatcher</code>](#AbstractPathMatcher) | see above. |
| handler | <code>function</code> \| [<code>AbstractController</code>](#AbstractController) | see above. |


* * *

<a name="AwesomeServer+unroute"></a>

### awesomeServer.unroute(method, path, handler) ⇒ <code>boolean</code>
Removes a route. In order to remove a route you must pass the exact same parameters you used
to create the route.

Routes may be removed whether or not AwesomeServer has been started.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: <code>boolean</code> - returns true if something was removed, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | see above. |
| path | <code>string</code> \| <code>RegExp</code> \| [<code>AbstractPathMatcher</code>](#AbstractPathMatcher) | see above. |
| handler | <code>function</code> \| [<code>AbstractController</code>](#AbstractController) | see above. |


* * *

<a name="AwesomeServer+removeAllRoutes"></a>

### awesomeServer.removeAllRoutes()
Utility for removing all routes.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer+redirect"></a>

### awesomeServer.redirect(method, path, toPath, [temporary])
A shortcut method for routing HTTP redirects.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| method | <code>string</code> |  | The method to match. |
| path | <code>string</code> \| <code>RegExp</code> \| [<code>AbstractPathMatcher</code>](#AbstractPathMatcher) |  | The path to match. |
| toPath | <code>string</code> |  | The redirect target. |
| [temporary] | <code>Boolean</code> | <code>false</code> | True if you want this to be a temporary redirect as defined in the HTTP Status Codes. |


* * *

<a name="AwesomeServer+serve"></a>

### awesomeServer.serve(path, contentType, filename)
A shortcut method for routing a specific file or set of files as a response. All
serve routes are GET only.

This method has two possilbe usages:

		serve(path,contentType,filename);
		serve(path,filename);

path: Standard path argument from `route()`.

contentType: The content-type to send when responding with the given file. if
contentType is null, AwesomeServer will attempt to guess the contentType based
on the filename. If it cannot guess, it will fallback to application-octet-stream.
contentType is ignored if filename is a directory, see below.

filename: A filename. Using filenames has some special intricacies to be aware of.

		resolving: The filename may be a resolved absolute path, or a relative path. In
		the case of relative paths, AwesomeServer will try to resolve the filename
		relative to itself, then relative to the module that called AwesomeServer,
		and finally relative to process.cwd().  The first resolved filename that
		exists is used.

		directories: If the filename resolves to a directory, AwesomeServer will
		route all the files in that directory and sub-directory based on name.
		For example, consider the directory tree:

			./files
				index.html
				hello.css
				resources
					image.gif

		IF the call `serve("*","/hello","./files")` is made, this would end up routing
		the following:

			`serve("/hello/index.html","./files/index.html")`
			`serve("/hello/hello.css","./files/hello.css")`
			`serve("/hello/resources/image.gif","./files/resources/image.gif")`

		The directory version of serve will also attempt to match the root name
		("/hello" in our example) to the root name plus "index.html"
		(/hello/index.html in our example).

		requirements: For a filename to be routed it must...

         - exist.

Please note that AwesomeServer will only serve files that exist when the serve function
is called.  Adding files after the fact is not supported.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> \| <code>RegExp</code> \| [<code>AbstractPathMatcher</code>](#AbstractPathMatcher) | The path to match. |
| contentType | <code>string</code> \| <code>null</code> | Optional contentType to use when serving. |
| filename | <code>string</code> | Filename or directory to serve. |


* * *

<a name="AwesomeServer+push"></a>

### awesomeServer.push(path, referencePath, contentType, filename)
A shortcut method for routing a specific file as a push portion of an http/2 request.

HTTP/2 allows for multiple response to be sent for a single incoming request. This
route approach lets you indicate certain files that should be pushed as part
of a HTTP/2 response; instead of having to create a custom route every time.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> \| <code>RegExp</code> \| [<code>AbstractPathMatcher</code>](#AbstractPathMatcher) | The path to match. |
| referencePath | <code>string</code> | the path the push is served as, used by http/2 in its resolve. |
| contentType | <code>string</code> \| <code>null</code> | Optional contentType to use when serving. |
| filename | <code>string</code> | Filename or directory to serve. |


* * *

<a name="AwesomeServer+resolve"></a>

### awesomeServer.resolve(filename) ⇒ <code>string</code> \| <code>null</code>
Given some file path, attempt to locate an existing version of that file path
based on the following rules:

		- absolute path;
		- relative to AwesomeServer;
		- relative to the module which created AwesomeServer;
		- relative to process.cwd().

The first of these that exists in the order outlined above, wins.  Of none
of these exists, returns null.

This function is useful for resolving against you developed code. It is also
used by the AwesomeServe wherever a filename is used.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: <code>string</code> \| <code>null</code> - fully resolved filename  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | filename to find |


* * *

<a name="AwesomeServer+handler"></a>

### awesomeServer.handler(response) ⇒ <code>Promise</code>
AwesomeServer's primary handler for incoming request.  Each server is given
this method to process incoming request against.

It is exposed here to be overloaded as needed.

,args @param  {AbstractRequest}   request  The incoming request request object.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: <code>Promise</code> - A promise that resolves when the request handling is complete.  

| Param | Type | Description |
| --- | --- | --- |
| response | [<code>AbstractResponse</code>](#AbstractResponse) | THe incoming request response object. |


* * *

<a name="AwesomeServer.AbstractServer"></a>

### AwesomeServer.AbstractServer ⇒
Returns a reference to the AbstractServer class for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: Class  

* * *

<a name="AwesomeServer.AbstractRequest"></a>

### AwesomeServer.AbstractRequest ⇒
Returns a reference to the AbstractRequest class for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: Class  

* * *

<a name="AwesomeServer.AbstractResponse"></a>

### AwesomeServer.AbstractResponse ⇒
Returns a reference to the AbstractResponse class for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: Class  

* * *

<a name="AwesomeServer.AbstractController"></a>

### AwesomeServer.AbstractController ⇒
Returns a reference to the AbstractController class for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: Class  

* * *

<a name="AwesomeServer.AbstractPathMatcher"></a>

### AwesomeServer.AbstractPathMatcher
Returns a reference to the AbstractPathMatcher class for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer.http"></a>

### AwesomeServer.http
Returns references to HTTPServer, HTTPRequest, and HTTPResponse for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer.https"></a>

### AwesomeServer.https
Returns references to HTTPSServer, HTTPSRequest, and HTTPSResponse for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer.http2"></a>

### AwesomeServer.http2
Returns references to HTTP2Server, HTTP2Request, and HTTP2Response for custom extensions.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *

<a name="AwesomeServer.controllers"></a>

### AwesomeServer.controllers
Returns reference to the built-in controllers.

**Kind**: static property of [<code>AwesomeServer</code>](#AwesomeServer)  

* * *


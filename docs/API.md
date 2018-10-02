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
    toString()
</code></pre></dd>
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
    read()
</code></pre><p>Provides the convenience methods:</p>
<pre><code>    readText()
    readJSON()
</code></pre></dd>
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
    pipeFrom()
</code></pre><p>Provides the convenience methods:</p>
<pre><code>    writeText()
    writeHTML()
    writeCSS()
    writeJSON()
    writeError()
    serve()
</code></pre></dd>
<dt><a href="#AbstractServer">AbstractServer</a></dt>
<dd><p>Describes the required shape of a server used by AwesomeServer.</p>
<p>The following functions are required to be implemented by
extending classes:</p>
<pre><code>    get running()
    get original()
    start()
    stop()
</code></pre></dd>
<dt><a href="#AwesomeServer">AwesomeServer</a></dt>
<dd><p>AwesomeServer is a customizable API Server framework for Enterprise Ready nodejs
applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
provide flexible routing and controllers for responding to incoming requests in a
consistent, repeatable fashion.</p>
<p>Please see the documentation at @link <a href="https://github.com/awesomeeng/AwesomeServer">https://github.com/awesomeeng/AwesomeServer</a>.</p>
</dd>
<dt><a href="#DirectoryServeController">DirectoryServeController</a> ⇐ <code><a href="#AbstractController">AbstractController</a></code></dt>
<dd><p>A specialized controller for serving a directory of content as incoming requests
come in. This controller is used from AwesomeServer.serve() when passed a directory.</p>
</dd>
<dt><a href="#FileServeController">FileServeController</a> ⇐ <code><a href="#AbstractController">AbstractController</a></code></dt>
<dd><p>A specialized controller for serving a a specific file as incoming requests
come in. This controller is used from AwesomeServer.serve() when passed a file.</p>
</dd>
<dt><a href="#PushServeController">PushServeController</a> ⇐ <code><a href="#AbstractController">AbstractController</a></code></dt>
<dd><p>A specialized controller for doing HTTP/2 push responses. This
controller is used from AwesomeServer.push().</p>
</dd>
<dt><a href="#FileServeController">FileServeController</a> ⇐ <code><a href="#AbstractController">AbstractController</a></code></dt>
<dd><p>A specialized controller for serving a redirects as incoming requests
come in. This controller is used from AwesomeServer.redirect() when passed a directory.</p>
</dd>
<dt><a href="#HTTPRequest">HTTPRequest</a> ⇐ <code><a href="#AbstractRequest">AbstractRequest</a></code></dt>
<dd><p>A wrapper for the nodejs http IncomingMessage object that is received
when an incoming request comes into the server.</p>
</dd>
<dt><a href="#HTTPResponse">HTTPResponse</a> ⇐ <code><a href="#AbstractRequest">AbstractRequest</a></code></dt>
<dd><p>A wrapper for the nodejs http ServerResponse object that is received
when an incoming request comes into the server.</p>
</dd>
<dt><a href="#HTTPServer">HTTPServer</a> ⇐ <code><a href="#AbstractServer">AbstractServer</a></code></dt>
<dd><p>HTTP implementation of AbstractServer, which is used by AwesomeServer
when AwesomeServer.addHTTPServer() is used. This is basically a
wrapper around nodejs&#39; http module.</p>
</dd>
<dt><a href="#HTTP2Request">HTTP2Request</a> ⇐ <code><a href="#HTTPSRequest">HTTPSRequest</a></code></dt>
<dd><p>HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
turn extends from HTTPRequest and AbstractRequest.  Most of the
details is in HTTPRequest.</p>
</dd>
<dt><a href="#HTTP2Response">HTTP2Response</a> ⇐ <code><a href="#HTTPSRequest">HTTPSRequest</a></code></dt>
<dd><p>HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
turn extends for HTTPRequest and AbstractRequest.  A lot of the
details is in HTTPRequest.</p>
</dd>
<dt><a href="#HTTP2Server">HTTP2Server</a> ⇐ <code><a href="#AbstractServer">AbstractServer</a></code></dt>
<dd><p>HTTP/2 implementation of AbstractServer, which is used by AwesomeServer
when AwesomeServer.addHTTP2Server() is used. This is basically a
wrapper around nodejs&#39; http2 module.</p>
</dd>
<dt><a href="#PushResponse">PushResponse</a></dt>
<dd><p>Class for wrapping HTTP/2 push response streams.</p>
<p>Given some HTTP2 response, it is possible to push additional assets as part of
the outgoing stream. To do so, we create a PushResponse for each additional
asset.</p>
<p>A PushResponse is created by calling PushResponse.create() instead of
by using its constructor.</p>
<p>Once created the PushResponse can be used to write or stream data as need. Calling
end() of a PushResponse closes just that PushResponse, and not the parent HTTP/2
response.</p>
</dd>
<dt><a href="#HTTPSRequest">HTTPSRequest</a> ⇐ <code><a href="#HTTPSRequest">HTTPSRequest</a></code></dt>
<dd><p>HTTPS Request wrapper class. Extends from HTTPRequest which in
turn extends from AbstractRequest.  Most of the
details is in HTTPRequest.</p>
</dd>
<dt><a href="#HTTPSResponse">HTTPSResponse</a> ⇐ <code><a href="#HTTPSRequest">HTTPSRequest</a></code></dt>
<dd><p>HTTPS Response wrapper class. Extends from HTTPRequest which in
turn extends from AbstractRequest.  Most of the
details is in HTTPRequest.</p>
</dd>
<dt><a href="#HTTPSServer">HTTPSServer</a> ⇐ <code><a href="#AbstractServer">AbstractServer</a></code></dt>
<dd><p>HTTPS implementation of AbstractServer, which is used by AwesomeServer
when AwesomeServer.addHTTPSServer() is used. This is basically a
wrapper around nodejs&#39; https module.</p>
</dd>
<dt><a href="#RegExpMatcher">RegExpMatcher</a> ⇐ <code><a href="#AbstractPathMatcher">AbstractPathMatcher</a></code></dt>
<dd><p>Matches a Regular Expression against a given path.</p>
</dd>
<dt><a href="#StringContainsMatcher">StringContainsMatcher</a> ⇐ <code><a href="#AbstractPathMatcher">AbstractPathMatcher</a></code></dt>
<dd><p>Matches any portion of a string against a given path.</p>
</dd>
<dt><a href="#StringEndsWithMatcher">StringEndsWithMatcher</a> ⇐ <code><a href="#AbstractPathMatcher">AbstractPathMatcher</a></code></dt>
<dd><p>Matches the beginning portion of a string against a given path.</p>
</dd>
<dt><a href="#StringExactMatcher">StringExactMatcher</a> ⇐ <code><a href="#AbstractPathMatcher">AbstractPathMatcher</a></code></dt>
<dd><p>Matches the entire string against a given path.</p>
</dd>
<dt><a href="#StringOrMatcher">StringOrMatcher</a> ⇐ <code><a href="#AbstractPathMatcher">AbstractPathMatcher</a></code></dt>
<dd><p>Matches the given path against at least 1 string PathMatcher expression.</p>
</dd>
<dt><a href="#StringStartsWithMatcher">StringStartsWithMatcher</a> ⇐ <code><a href="#AbstractPathMatcher">AbstractPathMatcher</a></code></dt>
<dd><p>Matches the beginning of a string against a given path.</p>
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
Returns the HTTP Method for this request.

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
| content | <code>string</code> \| <code>Error</code> |  | 
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
AwesomeServer is a customizable API Server framework for Enterprise Ready nodejs
applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
provide flexible routing and controllers for responding to incoming requests in a
consistent, repeatable fashion.

Please see the documentation at @link https://github.com/awesomeeng/AwesomeServer.

**Kind**: global class  

* [AwesomeServer](#AwesomeServer)
    * [new AwesomeServer()](#new_AwesomeServer_new)
    * _instance_
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
        * [.redirect(method, path, toPath, [temporary])](#AwesomeServer+redirect)
        * [.serve(path, contentType, filename)](#AwesomeServer+serve)
        * [.push(path, referencePath, contentType, filename)](#AwesomeServer+push)
        * [.resolve(filename)](#AwesomeServer+resolve) ⇒
        * [.handler(request, response)](#AwesomeServer+handler) ⇒ <code>Promise</code>
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
**Returns**: <code>Promise</code> - [description]  

* * *

<a name="AwesomeServer+stop"></a>

### awesomeServer.stop() ⇒ <code>Promise</code>
Stops the AwesomeServer instance, if running. This in turn will
stop each added server and stop routing incoming requests.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: <code>Promise</code> - [description]  

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
  host: "localhost"
  port: 7080
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
  host: "localhost"
  port: 7080,
  key: null,
  cert: null,
  pfx: null
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
  host: "localhost"
  port: 7080,
  key: null,
  cert: null,
  pfx: null
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

### awesomeServer.resolve(filename) ⇒
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
**Returns**: {(string|null)      fully resolved filename  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | filename to find |


* * *

<a name="AwesomeServer+handler"></a>

### awesomeServer.handler(request, response) ⇒ <code>Promise</code>
AwesomeServer's primary handler for incoming request.  Each server is given
this method to process incoming request against.

It is exposed here to be overloaded as needed.

**Kind**: instance method of [<code>AwesomeServer</code>](#AwesomeServer)  
**Returns**: <code>Promise</code> - A promise that resolves when the request handling is complete.  

| Param | Type | Description |
| --- | --- | --- |
| request | [<code>AbstractRequest</code>](#AbstractRequest) | The incoming request request object. |
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

<a name="DirectoryServeController"></a>

## DirectoryServeController ⇐ [<code>AbstractController</code>](#AbstractController)
A specialized controller for serving a directory of content as incoming requests
come in. This controller is used from AwesomeServer.serve() when passed a directory.

**Kind**: global class  
**Extends**: [<code>AbstractController</code>](#AbstractController)  

* [DirectoryServeController](#DirectoryServeController) ⇐ [<code>AbstractController</code>](#AbstractController)
    * [new DirectoryServeController(dir)](#new_DirectoryServeController_new)
    * [.dir](#DirectoryServeController+dir) ⇒ <code>string</code>
    * [.get(path, request, response)](#DirectoryServeController+get) ⇒ <code>Promise</code>
    * [.before()](#AbstractController+before) ⇒ <code>Promise</code> \| <code>void</code>
    * [.after()](#AbstractController+after) ⇒ <code>Promise</code> \| <code>void</code>
    * [.any()](#AbstractController+any) ⇒ <code>Promise</code> \| <code>void</code>
    * [.handler(path, request, response)](#AbstractController+handler) ⇒ <code>Promise</code>


* * *

<a name="new_DirectoryServeController_new"></a>

### new DirectoryServeController(dir)
Instantiate the controller.


| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | fully resolved directory. |


* * *

<a name="DirectoryServeController+dir"></a>

### directoryServeController.dir ⇒ <code>string</code>
Returns the directory being served.

**Kind**: instance property of [<code>DirectoryServeController</code>](#DirectoryServeController)  

* * *

<a name="DirectoryServeController+get"></a>

### directoryServeController.get(path, request, response) ⇒ <code>Promise</code>
get handler. Returns a Promise that resolves when the response
is completed.  If a request does not match a file in the
directory, a 404 error is returned.

**Kind**: instance method of [<code>DirectoryServeController</code>](#DirectoryServeController)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| request | [<code>AbstractRequest</code>](#AbstractRequest) | 
| response | [<code>AbstractResponse</code>](#AbstractResponse) | 


* * *

<a name="AbstractController+before"></a>

### directoryServeController.before() ⇒ <code>Promise</code> \| <code>void</code>
Executed before each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>DirectoryServeController</code>](#DirectoryServeController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before moving the the handler function.  

* * *

<a name="AbstractController+after"></a>

### directoryServeController.after() ⇒ <code>Promise</code> \| <code>void</code>
Executed after each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>DirectoryServeController</code>](#DirectoryServeController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+any"></a>

### directoryServeController.any() ⇒ <code>Promise</code> \| <code>void</code>
Executed only if a request method is not implemented in the controller. Can be used
as a kind of catch-all for requests.

**Kind**: instance method of [<code>DirectoryServeController</code>](#DirectoryServeController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+handler"></a>

### directoryServeController.handler(path, request, response) ⇒ <code>Promise</code>
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

**Kind**: instance method of [<code>DirectoryServeController</code>](#DirectoryServeController)  
**Returns**: <code>Promise</code> - Returns a Promise that resolves when the request has been handled.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The remaining path string, after the matching route portion is removed. |
| request | [<code>AbstractRequest</code>](#AbstractRequest) | The request object. |
| response | [<code>AbstractResponse</code>](#AbstractResponse) | The response object. |


* * *

<a name="FileServeController"></a>

## FileServeController ⇐ [<code>AbstractController</code>](#AbstractController)
A specialized controller for serving a a specific file as incoming requests
come in. This controller is used from AwesomeServer.serve() when passed a file.

**Kind**: global class  
**Extends**: [<code>AbstractController</code>](#AbstractController)  

* [FileServeController](#FileServeController) ⇐ [<code>AbstractController</code>](#AbstractController)
    * [new FileServeController(contentType, filename)](#new_FileServeController_new)
    * [new FileServeController(toPath, [temporary])](#new_FileServeController_new)
    * [.filename](#FileServeController+filename) ⇒ <code>string</code>
    * [.contentType](#FileServeController+contentType) ⇒ <code>string</code> \| <code>null</code>
    * [.toPath](#FileServeController+toPath) ⇒ <code>string</code>
    * [.temporary](#FileServeController+temporary) ⇒ <code>boolean</code>
    * [.get(path, request, response)](#FileServeController+get) ⇒ <code>Promise</code>
    * [.any(path, request, response)](#FileServeController+any) ⇒ <code>Promise</code>
    * [.before()](#AbstractController+before) ⇒ <code>Promise</code> \| <code>void</code>
    * [.after()](#AbstractController+after) ⇒ <code>Promise</code> \| <code>void</code>
    * [.handler(path, request, response)](#AbstractController+handler) ⇒ <code>Promise</code>


* * *

<a name="new_FileServeController_new"></a>

### new FileServeController(contentType, filename)
Instantiate the controller. Given some filename, handle incoming requests
by responding with the contentType and contents of the file.

If contentType is not provided, the controller will attempt to guess
the contentType from the filename. It will return "application/octet-stream"
if no contentType can be guessed.

The filename needs to have been fully resolved.


| Param | Type |
| --- | --- |
| contentType | <code>string</code> \| <code>null</code> | 
| filename | <code>string</code> | 


* * *

<a name="new_FileServeController_new"></a>

### new FileServeController(toPath, [temporary])
Instantiate the controller. As incoming requests come in and match this
controller, a 302 (for temporary) or a 301 (for permanent) redirect is
sent with the toPath as the Location value.


| Param | Type | Default |
| --- | --- | --- |
| toPath | <code>string</code> |  | 
| [temporary] | <code>boolean</code> | <code>false</code> | 


* * *

<a name="FileServeController+filename"></a>

### fileServeController.filename ⇒ <code>string</code>
Returns the filename passed into the constructor.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+contentType"></a>

### fileServeController.contentType ⇒ <code>string</code> \| <code>null</code>
Returns the contentType. If the contentType passed into the controller
was null, this will return the guessed contentType.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+toPath"></a>

### fileServeController.toPath ⇒ <code>string</code>
The toPath passed into the controller.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+temporary"></a>

### fileServeController.temporary ⇒ <code>boolean</code>
The temporary boolean passed into the controller.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+get"></a>

### fileServeController.get(path, request, response) ⇒ <code>Promise</code>
Get handler.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| request | [<code>AbstractRequest</code>](#AbstractRequest) | 
| response | [<code>AbstractResponse</code>](#AbstractResponse) | 


* * *

<a name="FileServeController+any"></a>

### fileServeController.any(path, request, response) ⇒ <code>Promise</code>
any handler which will redirect any incoming request regardless of
method to our new location.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>any</code>](#AbstractController+any)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| request | [<code>AbstractRequest</code>](#AbstractRequest) | 
| response | [<code>AbstractResponse</code>](#AbstractResponse) | 


* * *

<a name="AbstractController+before"></a>

### fileServeController.before() ⇒ <code>Promise</code> \| <code>void</code>
Executed before each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>before</code>](#AbstractController+before)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before moving the the handler function.  

* * *

<a name="AbstractController+after"></a>

### fileServeController.after() ⇒ <code>Promise</code> \| <code>void</code>
Executed after each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>after</code>](#AbstractController+after)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+handler"></a>

### fileServeController.handler(path, request, response) ⇒ <code>Promise</code>
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

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>handler</code>](#AbstractController+handler)  
**Returns**: <code>Promise</code> - Returns a Promise that resolves when the request has been handled.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The remaining path string, after the matching route portion is removed. |
| request | [<code>AbstractRequest</code>](#AbstractRequest) | The request object. |
| response | [<code>AbstractResponse</code>](#AbstractResponse) | The response object. |


* * *

<a name="PushServeController"></a>

## PushServeController ⇐ [<code>AbstractController</code>](#AbstractController)
A specialized controller for doing HTTP/2 push responses. This
controller is used from AwesomeServer.push().

**Kind**: global class  
**Extends**: [<code>AbstractController</code>](#AbstractController)  

* [PushServeController](#PushServeController) ⇐ [<code>AbstractController</code>](#AbstractController)
    * [new PushServeController(referencePath, contentType, filename)](#new_PushServeController_new)
    * [.filename](#PushServeController+filename) ⇒ <code>string</code>
    * [.contentType](#PushServeController+contentType) ⇒ <code>string</code>
    * [.referencePath](#PushServeController+referencePath) ⇒ <code>string</code>
    * [.get(path, request, response)](#PushServeController+get) ⇒ <code>Promise</code>
    * [.before()](#AbstractController+before) ⇒ <code>Promise</code> \| <code>void</code>
    * [.after()](#AbstractController+after) ⇒ <code>Promise</code> \| <code>void</code>
    * [.any()](#AbstractController+any) ⇒ <code>Promise</code> \| <code>void</code>
    * [.handler(path, request, response)](#AbstractController+handler) ⇒ <code>Promise</code>


* * *

<a name="new_PushServeController_new"></a>

### new PushServeController(referencePath, contentType, filename)
Instantiate the controller to push the given filename resource with the
given contentType and referencePath.

THe filename should be fully resvoled and must exist.

THe referencePath is the filename which the push request is labeled with
and used by the client side of HTTP/2 resolving.

If contentType is null the controller will attempt to guess the contentType
from the filename. If it cannot do that it will fallback to
"application/octet-stream".


| Param | Type |
| --- | --- |
| referencePath | <code>string</code> | 
| contentType | <code>string</code> \| <code>null</code> | 
| filename | <code>string</code> | 


* * *

<a name="PushServeController+filename"></a>

### pushServeController.filename ⇒ <code>string</code>
Returns the filename passed to the constructor.

**Kind**: instance property of [<code>PushServeController</code>](#PushServeController)  

* * *

<a name="PushServeController+contentType"></a>

### pushServeController.contentType ⇒ <code>string</code>
Returns the contentType. If the contentType passed to the constructor was
null, this will return the guessed contentType or "application/octet-stream".

**Kind**: instance property of [<code>PushServeController</code>](#PushServeController)  

* * *

<a name="PushServeController+referencePath"></a>

### pushServeController.referencePath ⇒ <code>string</code>
Returns the referencePath passed into the constructor.

**Kind**: instance property of [<code>PushServeController</code>](#PushServeController)  

* * *

<a name="PushServeController+get"></a>

### pushServeController.get(path, request, response) ⇒ <code>Promise</code>
get handler.

**Kind**: instance method of [<code>PushServeController</code>](#PushServeController)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| request | [<code>AbstractRequest</code>](#AbstractRequest) | 
| response | [<code>AbstractResponse</code>](#AbstractResponse) | 


* * *

<a name="AbstractController+before"></a>

### pushServeController.before() ⇒ <code>Promise</code> \| <code>void</code>
Executed before each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>PushServeController</code>](#PushServeController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before moving the the handler function.  

* * *

<a name="AbstractController+after"></a>

### pushServeController.after() ⇒ <code>Promise</code> \| <code>void</code>
Executed after each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>PushServeController</code>](#PushServeController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+any"></a>

### pushServeController.any() ⇒ <code>Promise</code> \| <code>void</code>
Executed only if a request method is not implemented in the controller. Can be used
as a kind of catch-all for requests.

**Kind**: instance method of [<code>PushServeController</code>](#PushServeController)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+handler"></a>

### pushServeController.handler(path, request, response) ⇒ <code>Promise</code>
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

**Kind**: instance method of [<code>PushServeController</code>](#PushServeController)  
**Returns**: <code>Promise</code> - Returns a Promise that resolves when the request has been handled.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The remaining path string, after the matching route portion is removed. |
| request | [<code>AbstractRequest</code>](#AbstractRequest) | The request object. |
| response | [<code>AbstractResponse</code>](#AbstractResponse) | The response object. |


* * *

<a name="FileServeController"></a>

## FileServeController ⇐ [<code>AbstractController</code>](#AbstractController)
A specialized controller for serving a redirects as incoming requests
come in. This controller is used from AwesomeServer.redirect() when passed a directory.

**Kind**: global class  
**Extends**: [<code>AbstractController</code>](#AbstractController)  

* [FileServeController](#FileServeController) ⇐ [<code>AbstractController</code>](#AbstractController)
    * [new FileServeController(contentType, filename)](#new_FileServeController_new)
    * [new FileServeController(toPath, [temporary])](#new_FileServeController_new)
    * [.filename](#FileServeController+filename) ⇒ <code>string</code>
    * [.contentType](#FileServeController+contentType) ⇒ <code>string</code> \| <code>null</code>
    * [.toPath](#FileServeController+toPath) ⇒ <code>string</code>
    * [.temporary](#FileServeController+temporary) ⇒ <code>boolean</code>
    * [.get(path, request, response)](#FileServeController+get) ⇒ <code>Promise</code>
    * [.any(path, request, response)](#FileServeController+any) ⇒ <code>Promise</code>
    * [.before()](#AbstractController+before) ⇒ <code>Promise</code> \| <code>void</code>
    * [.after()](#AbstractController+after) ⇒ <code>Promise</code> \| <code>void</code>
    * [.handler(path, request, response)](#AbstractController+handler) ⇒ <code>Promise</code>


* * *

<a name="new_FileServeController_new"></a>

### new FileServeController(contentType, filename)
Instantiate the controller. Given some filename, handle incoming requests
by responding with the contentType and contents of the file.

If contentType is not provided, the controller will attempt to guess
the contentType from the filename. It will return "application/octet-stream"
if no contentType can be guessed.

The filename needs to have been fully resolved.


| Param | Type |
| --- | --- |
| contentType | <code>string</code> \| <code>null</code> | 
| filename | <code>string</code> | 


* * *

<a name="new_FileServeController_new"></a>

### new FileServeController(toPath, [temporary])
Instantiate the controller. As incoming requests come in and match this
controller, a 302 (for temporary) or a 301 (for permanent) redirect is
sent with the toPath as the Location value.


| Param | Type | Default |
| --- | --- | --- |
| toPath | <code>string</code> |  | 
| [temporary] | <code>boolean</code> | <code>false</code> | 


* * *

<a name="FileServeController+filename"></a>

### fileServeController.filename ⇒ <code>string</code>
Returns the filename passed into the constructor.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+contentType"></a>

### fileServeController.contentType ⇒ <code>string</code> \| <code>null</code>
Returns the contentType. If the contentType passed into the controller
was null, this will return the guessed contentType.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+toPath"></a>

### fileServeController.toPath ⇒ <code>string</code>
The toPath passed into the controller.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+temporary"></a>

### fileServeController.temporary ⇒ <code>boolean</code>
The temporary boolean passed into the controller.

**Kind**: instance property of [<code>FileServeController</code>](#FileServeController)  

* * *

<a name="FileServeController+get"></a>

### fileServeController.get(path, request, response) ⇒ <code>Promise</code>
Get handler.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| request | [<code>AbstractRequest</code>](#AbstractRequest) | 
| response | [<code>AbstractResponse</code>](#AbstractResponse) | 


* * *

<a name="FileServeController+any"></a>

### fileServeController.any(path, request, response) ⇒ <code>Promise</code>
any handler which will redirect any incoming request regardless of
method to our new location.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>any</code>](#AbstractController+any)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| request | [<code>AbstractRequest</code>](#AbstractRequest) | 
| response | [<code>AbstractResponse</code>](#AbstractResponse) | 


* * *

<a name="AbstractController+before"></a>

### fileServeController.before() ⇒ <code>Promise</code> \| <code>void</code>
Executed before each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>before</code>](#AbstractController+before)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before moving the the handler function.  

* * *

<a name="AbstractController+after"></a>

### fileServeController.after() ⇒ <code>Promise</code> \| <code>void</code>
Executed after each individual request is handled. This will execute ONLY IF the
request method is implemented in the controller.

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>after</code>](#AbstractController+after)  
**Returns**: <code>Promise</code> \| <code>void</code> - May return a promise or nothing. If a promise is returned, the promise is awaited
before the final resolve.  

* * *

<a name="AbstractController+handler"></a>

### fileServeController.handler(path, request, response) ⇒ <code>Promise</code>
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

**Kind**: instance method of [<code>FileServeController</code>](#FileServeController)  
**Overrides**: [<code>handler</code>](#AbstractController+handler)  
**Returns**: <code>Promise</code> - Returns a Promise that resolves when the request has been handled.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The remaining path string, after the matching route portion is removed. |
| request | [<code>AbstractRequest</code>](#AbstractRequest) | The request object. |
| response | [<code>AbstractResponse</code>](#AbstractResponse) | The response object. |


* * *

<a name="HTTPRequest"></a>

## HTTPRequest ⇐ [<code>AbstractRequest</code>](#AbstractRequest)
A wrapper for the nodejs http IncomingMessage object that is received
when an incoming request comes into the server.

**Kind**: global class  
**Extends**: [<code>AbstractRequest</code>](#AbstractRequest)  

* [HTTPRequest](#HTTPRequest) ⇐ [<code>AbstractRequest</code>](#AbstractRequest)
    * [new HTTPRequest(request)](#new_HTTPRequest_new)
    * [.origin](#HTTPRequest+origin) ⇒ <code>string</code>
    * [.method](#HTTPRequest+method) ⇒ <code>string</code>
    * [.url](#HTTPRequest+url) ⇒ <code>URL</code>
    * [.path](#HTTPRequest+path) ⇒ <code>string</code>
    * [.query](#HTTPRequest+query) ⇒ <code>Object</code>
    * [.querystring](#HTTPRequest+querystring) ⇒ <code>string</code>
    * [.headers](#HTTPRequest+headers) ⇒ <code>Object</code>
    * [.contentType](#HTTPRequest+contentType) ⇒ <code>string</code>
    * [.contentEncoding](#HTTPRequest+contentEncoding) ⇒ <code>string</code>
    * [.useragent](#HTTPRequest+useragent) ⇒ <code>string</code>
    * [.original](#AbstractRequest+original) ⇒ <code>\*</code>
    * [.read()](#HTTPRequest+read) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.readText([encoding])](#AbstractRequest+readText) ⇒ <code>Promise</code>
    * [.readJSON([encoding])](#AbstractRequest+readJSON) ⇒ <code>Promise</code>


* * *

<a name="new_HTTPRequest_new"></a>

### new HTTPRequest(request)
Constructor which takes the nodejs http IncomingMessage and wraps
it in a custom AbstractRequest object.


| Param | Type |
| --- | --- |
| request | <code>IncomingMessage</code> | 


* * *

<a name="HTTPRequest+origin"></a>

### httpRequest.origin ⇒ <code>string</code>
Returns the origin details for the incoming request, to the best
of its ability to figure out.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>origin</code>](#AbstractRequest+origin)  

* * *

<a name="HTTPRequest+method"></a>

### httpRequest.method ⇒ <code>string</code>
Returns the method for this request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>method</code>](#AbstractRequest+method)  

* * *

<a name="HTTPRequest+url"></a>

### httpRequest.url ⇒ <code>URL</code>
Returns the URL object for this request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>url</code>](#AbstractRequest+url)  

* * *

<a name="HTTPRequest+path"></a>

### httpRequest.path ⇒ <code>string</code>
Returns the path portion of the URL for this request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>path</code>](#AbstractRequest+path)  

* * *

<a name="HTTPRequest+query"></a>

### httpRequest.query ⇒ <code>Object</code>
Returns the parsed query object from the URL for this request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>query</code>](#AbstractRequest+query)  

* * *

<a name="HTTPRequest+querystring"></a>

### httpRequest.querystring ⇒ <code>string</code>
Returns the string form of the query/search section of the
URL for this request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>querystring</code>](#AbstractRequest+querystring)  

* * *

<a name="HTTPRequest+headers"></a>

### httpRequest.headers ⇒ <code>Object</code>
Returns the headers as an object for this request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>headers</code>](#AbstractRequest+headers)  

* * *

<a name="HTTPRequest+contentType"></a>

### httpRequest.contentType ⇒ <code>string</code>
Returns the mime-type portion of the content-type header for this
request.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>contentType</code>](#AbstractRequest+contentType)  

* * *

<a name="HTTPRequest+contentEncoding"></a>

### httpRequest.contentEncoding ⇒ <code>string</code>
Returns the charset (encoding) portion of the content-type header
for this request. If no encoding is provided, returns "utf-8".

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>contentEncoding</code>](#AbstractRequest+contentEncoding)  

* * *

<a name="HTTPRequest+useragent"></a>

### httpRequest.useragent ⇒ <code>string</code>
Returns the user-agent header for this request object, if any.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>useragent</code>](#AbstractRequest+useragent)  

* * *

<a name="AbstractRequest+original"></a>

### httpRequest.original ⇒ <code>\*</code>
Returns the original, underlying request object, whatever that might be.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPRequest</code>](#HTTPRequest)  

* * *

<a name="HTTPRequest+read"></a>

### httpRequest.read() ⇒ <code>Promise.&lt;Buffer&gt;</code>
Returns a Promise that will resolve when the content body of this
request, if any, is completely read. The resolve returns a Buffer
object. AbstractRequest provides helper functions `readText()` and
`readJSON()` to perform read but return more usable values.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  
**Overrides**: [<code>read</code>](#AbstractRequest+read)  

* * *

<a name="AbstractRequest+readText"></a>

### httpRequest.readText([encoding]) ⇒ <code>Promise</code>
Conveience method to read the body content of the request as
as plain text string using the given encoding (or utf-8 if
no encoding is given).

Returns a Promise that will resolve when the content is read
as a string.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  

| Param | Type | Default |
| --- | --- | --- |
| [encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | 


* * *

<a name="AbstractRequest+readJSON"></a>

### httpRequest.readJSON([encoding]) ⇒ <code>Promise</code>
Convenience method to read the body content of the request as
a text string using the given encoding (or utf-8 if no encoding is given)
and then parse it as json.

Returns a Promise that will resolve when the content is read as a
string and then parsed as json. Will reject if the parse fails.

**Kind**: instance method of [<code>HTTPRequest</code>](#HTTPRequest)  

| Param | Type | Default |
| --- | --- | --- |
| [encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | 


* * *

<a name="HTTPResponse"></a>

## HTTPResponse ⇐ [<code>AbstractRequest</code>](#AbstractRequest)
A wrapper for the nodejs http ServerResponse object that is received
when an incoming request comes into the server.

**Kind**: global class  
**Extends**: [<code>AbstractRequest</code>](#AbstractRequest)  

* [HTTPResponse](#HTTPResponse) ⇐ [<code>AbstractRequest</code>](#AbstractRequest)
    * [new HTTPResponse(request)](#new_HTTPResponse_new)
    * [.finished](#HTTPResponse+finished) ⇒ <code>boolean</code>
    * [.statusCode](#HTTPResponse+statusCode) ⇒ <code>number</code>
    * [.headers](#HTTPResponse+headers) ⇒ <code>Object</code>
    * [.contentType](#HTTPResponse+contentType) ⇒ <code>String</code>
    * [.contentEncoding](#HTTPResponse+contentEncoding) ⇒ <code>String</code>
    * [.original](#AbstractRequest+original) ⇒ <code>\*</code>
    * [.origin](#AbstractRequest+origin) ⇒ <code>string</code>
    * [.method](#AbstractRequest+method) ⇒ <code>string</code>
    * [.url](#AbstractRequest+url) ⇒ <code>URL</code>
    * [.path](#AbstractRequest+path) ⇒ <code>string</code>
    * [.query](#AbstractRequest+query) ⇒ <code>Object</code>
    * [.querystring](#AbstractRequest+querystring) ⇒ <code>string</code>
    * [.useragent](#AbstractRequest+useragent) ⇒ <code>string</code>
    * [.writeHead(statusCode, statusMessage, headers)](#HTTPResponse+writeHead)
    * [.write(data, encoding)](#HTTPResponse+write) ⇒ <code>Promise</code>
    * [.end(data, encoding)](#HTTPResponse+end) ⇒ <code>Promise</code>
    * [.pipeFrom()](#HTTPResponse+pipeFrom) ⇒ <code>Promise</code>
    * [.read()](#AbstractRequest+read) ⇒ <code>type</code>
    * [.readText([encoding])](#AbstractRequest+readText) ⇒ <code>Promise</code>
    * [.readJSON([encoding])](#AbstractRequest+readJSON) ⇒ <code>Promise</code>


* * *

<a name="new_HTTPResponse_new"></a>

### new HTTPResponse(request)
Constructor which takes the nodejs http ServerResponse and wraps
it in a custom AbstractRequest object.


| Param | Type |
| --- | --- |
| request | <code>ServerResponse</code> | 


* * *

<a name="HTTPResponse+finished"></a>

### httpResponse.finished ⇒ <code>boolean</code>
Returns true when the response is finished (end() has been called)
and cannot receive any more data/changes.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="HTTPResponse+statusCode"></a>

### httpResponse.statusCode ⇒ <code>number</code>
Returns the status code set with writeHead for this response.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="HTTPResponse+headers"></a>

### httpResponse.headers ⇒ <code>Object</code>
Returns the headers set with writeHead for this response.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  
**Overrides**: [<code>headers</code>](#AbstractRequest+headers)  

* * *

<a name="HTTPResponse+contentType"></a>

### httpResponse.contentType ⇒ <code>String</code>
Returns the mime-type portion from the content-type header.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  
**Overrides**: [<code>contentType</code>](#AbstractRequest+contentType)  

* * *

<a name="HTTPResponse+contentEncoding"></a>

### httpResponse.contentEncoding ⇒ <code>String</code>
Returns the charset (encoding) portion from the content-type
header for this response.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  
**Overrides**: [<code>contentEncoding</code>](#AbstractRequest+contentEncoding)  

* * *

<a name="AbstractRequest+original"></a>

### httpResponse.original ⇒ <code>\*</code>
Returns the original, underlying request object, whatever that might be.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+origin"></a>

### httpResponse.origin ⇒ <code>string</code>
Returns the origin, as a string, of where the request is coming from, if that
information makes sense and is possible to return. Returns an empty string otherwise.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+method"></a>

### httpResponse.method ⇒ <code>string</code>
Returns the HTTP Method for this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+url"></a>

### httpResponse.url ⇒ <code>URL</code>
Returns the URL (as a nodejs URL object) of this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+path"></a>

### httpResponse.path ⇒ <code>string</code>
Returns the path, usually taken from the url, of this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+query"></a>

### httpResponse.query ⇒ <code>Object</code>
Returns the query/search portion of te url as a fully parsed query
object (usualy via nodejs querystring) of this request.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+querystring"></a>

### httpResponse.querystring ⇒ <code>string</code>
Returns the query/search portion of the url as a string.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+useragent"></a>

### httpResponse.useragent ⇒ <code>string</code>
Returns the user-agent string for this request, usually from the headers.

It is up to the implementor on how this is obtained.

**Kind**: instance property of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="HTTPResponse+writeHead"></a>

### httpResponse.writeHead(statusCode, statusMessage, headers)
Sets the status code and headers for the response. This may only be
called once per request and cannot be called after a write() or
and end() has been called.

Unlike write() and end() this does not return a Promise and does
not need to be preceeded by an await.

THe headers parameter should have the header keys as lower case.

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> |  |
| statusMessage | <code>string</code> \| <code>null</code> | optional. |
| headers | <code>Object</code> | optional. |


* * *

<a name="HTTPResponse+write"></a>

### httpResponse.write(data, encoding) ⇒ <code>Promise</code>
Writes a chunk of data to the response with the given encoding.

Returns a Promise that will resolve when the write is complete.
It is always good practice to await a write().

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> \| <code>string</code> |  |
| encoding | <code>string</code> | optional. Defaults to utf-8. |


* * *

<a name="HTTPResponse+end"></a>

### httpResponse.end(data, encoding) ⇒ <code>Promise</code>
Writes the passed in data to the response with the given encoding
and then marks the response finished.

Returns a Promise that will resolve when the end is complete.
It is always good practice to await an end().

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> \| <code>string</code> |  |
| encoding | <code>string</code> | optional. Defaults to utf-8. |


* * *

<a name="HTTPResponse+pipeFrom"></a>

### httpResponse.pipeFrom() ⇒ <code>Promise</code>
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

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+read"></a>

### httpResponse.read() ⇒ <code>type</code>
Returns a Promise that resolves with a Buffer that contains the
entire body content of the request, if any, or null if not.

This must resolve with null or a Buffer. Do not resolve with a string.

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

* * *

<a name="AbstractRequest+readText"></a>

### httpResponse.readText([encoding]) ⇒ <code>Promise</code>
Conveience method to read the body content of the request as
as plain text string using the given encoding (or utf-8 if
no encoding is given).

Returns a Promise that will resolve when the content is read
as a string.

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

| Param | Type | Default |
| --- | --- | --- |
| [encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | 


* * *

<a name="AbstractRequest+readJSON"></a>

### httpResponse.readJSON([encoding]) ⇒ <code>Promise</code>
Convenience method to read the body content of the request as
a text string using the given encoding (or utf-8 if no encoding is given)
and then parse it as json.

Returns a Promise that will resolve when the content is read as a
string and then parsed as json. Will reject if the parse fails.

**Kind**: instance method of [<code>HTTPResponse</code>](#HTTPResponse)  

| Param | Type | Default |
| --- | --- | --- |
| [encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | 


* * *

<a name="HTTPServer"></a>

## HTTPServer ⇐ [<code>AbstractServer</code>](#AbstractServer)
HTTP implementation of AbstractServer, which is used by AwesomeServer
when AwesomeServer.addHTTPServer() is used. This is basically a
wrapper around nodejs' http module.

**Kind**: global class  
**Extends**: [<code>AbstractServer</code>](#AbstractServer)  

* [HTTPServer](#HTTPServer) ⇐ [<code>AbstractServer</code>](#AbstractServer)
    * [new HTTPServer(config)](#new_HTTPServer_new)
    * [.running](#HTTPServer+running) ⇒ <code>boolean</code>
    * [.original](#HTTPServer+original) ⇒ <code>\*</code>
    * [.config](#AbstractServer+config) ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
    * [.start(handler)](#HTTPServer+start) ⇒ <code>Promise</code>
    * [.stop()](#HTTPServer+stop) ⇒ <code>Promise</code>
    * [.handleRequest(handler, request, response)](#HTTPServer+handleRequest)


* * *

<a name="new_HTTPServer_new"></a>

### new HTTPServer(config)
Creates a new HTTP Server to the AwesomeServer instance. The HTTP Server is
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
  host: "localhost"
  port: 7080
};
```
For more details about config values, please see [nodejs' http module]()

**An important note about config**: The default *host* setting for AwesomeServer
is `localhost`. This is different than the default for the underlying
nodejs http module of `0.0.0.0`.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | An AwesomeConfig or plain Object. |


* * *

<a name="HTTPServer+running"></a>

### httpServer.running ⇒ <code>boolean</code>
Returns true if this server is started.

**Kind**: instance property of [<code>HTTPServer</code>](#HTTPServer)  
**Overrides**: [<code>running</code>](#AbstractServer+running)  

* * *

<a name="HTTPServer+original"></a>

### httpServer.original ⇒ <code>\*</code>
Returns the underlying, wrapped, nodejs http server.

**Kind**: instance property of [<code>HTTPServer</code>](#HTTPServer)  
**Overrides**: [<code>original</code>](#AbstractServer+original)  

* * *

<a name="AbstractServer+config"></a>

### httpServer.config ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
Returns the passed in config object.

**Kind**: instance property of [<code>HTTPServer</code>](#HTTPServer)  

* * *

<a name="HTTPServer+start"></a>

### httpServer.start(handler) ⇒ <code>Promise</code>
Starts this server running and accepting requests. This effectively
creates the nodejs http server, and begins the listening process,
routing incoming requests to the provided handler.

AwesomeServer will call this method when AwesomeServer is started
and provides the handler it wants used for incoming requests.

This function returns a Promise that will resolve when the server
has started listening, or rejects if there is an error.

**Kind**: instance method of [<code>HTTPServer</code>](#HTTPServer)  
**Overrides**: [<code>start</code>](#AbstractServer+start)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="HTTPServer+stop"></a>

### httpServer.stop() ⇒ <code>Promise</code>
Stops the server running.

Returns a Promise that will resolve when the underlying server
has stopped.

**Kind**: instance method of [<code>HTTPServer</code>](#HTTPServer)  
**Overrides**: [<code>stop</code>](#AbstractServer+stop)  

* * *

<a name="HTTPServer+handleRequest"></a>

### httpServer.handleRequest(handler, request, response)
A wrapper function for the handler called by the underlying server
when a new request occurs. This handler is responsible for wrapping
the incoming request's request object and response object in a
HTTPRequest and HTTPResponse respectively. Finally, it calls
the handler AwesomeServer provided when it started the server.

**Kind**: instance method of [<code>HTTPServer</code>](#HTTPServer)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 
| request | <code>\*</code> | 
| response | <code>\*</code> | 


* * *

<a name="HTTP2Request"></a>

## HTTP2Request ⇐ [<code>HTTPSRequest</code>](#HTTPSRequest)
HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
turn extends from HTTPRequest and AbstractRequest.  Most of the
details is in HTTPRequest.

**Kind**: global class  
**Extends**: [<code>HTTPSRequest</code>](#HTTPSRequest)  

* * *

<a name="new_HTTP2Request_new"></a>

### new HTTP2Request(request, response)

| Param | Type |
| --- | --- |
| request | <code>IncomingMessage</code> | 
| response | <code>ServerResponse</code> | 


* * *

<a name="HTTP2Response"></a>

## HTTP2Response ⇐ [<code>HTTPSRequest</code>](#HTTPSRequest)
HTTP/2 Request wrapper class. Extends from HTTPSRequest which in
turn extends for HTTPRequest and AbstractRequest.  A lot of the
details is in HTTPRequest.

**Kind**: global class  
**Extends**: [<code>HTTPSRequest</code>](#HTTPSRequest)  

* [HTTP2Response](#HTTP2Response) ⇐ [<code>HTTPSRequest</code>](#HTTPSRequest)
    * [new HTTP2Response(request, response)](#new_HTTP2Response_new)
    * [.stream](#HTTP2Response+stream) ⇒ <code>Http2Stream</code>
    * [.serverRoot](#HTTP2Response+serverRoot) ⇒ <code>string</code>
    * [.pushSupported](#HTTP2Response+pushSupported) ⇒ <code>boolean</code>
    * [.resolve(path)](#HTTP2Response+resolve) ⇒ <code>string</code>
    * [.push(statusCode, path, contentType, content, [headers])](#HTTP2Response+push) ⇒ <code>Promise</code>
    * [.pushText(statusCode, path, content, headers)](#HTTP2Response+pushText) ⇒ <code>Promise</code>
    * [.pushCSS(statusCode, path, content, headers)](#HTTP2Response+pushCSS) ⇒ <code>Promise</code>
    * [.pushHTML(statusCode, path, content, headers)](#HTTP2Response+pushHTML) ⇒ <code>Promise</code>
    * [.pushJSON(statusCode, path, content, headers)](#HTTP2Response+pushJSON) ⇒ <code>Promise</code>
    * [.pushServe(statusCode, path, contentType, filename, headers)](#HTTP2Response+pushServe) ⇒ <code>Promise</code>


* * *

<a name="new_HTTP2Response_new"></a>

### new HTTP2Response(request, response)

| Param | Type |
| --- | --- |
| request | <code>IncomingMessage</code> | 
| response | <code>ServerResponse</code> | 


* * *

<a name="HTTP2Response+stream"></a>

### httP2Response.stream ⇒ <code>Http2Stream</code>
Returns the underlying HTTP/2 stream for this response.

**Kind**: instance property of [<code>HTTP2Response</code>](#HTTP2Response)  

* * *

<a name="HTTP2Response+serverRoot"></a>

### httP2Response.serverRoot ⇒ <code>string</code>
Returns the relative server root for this incoming request. This allows
the response to send back relative responses.

**Kind**: instance property of [<code>HTTP2Response</code>](#HTTP2Response)  

* * *

<a name="HTTP2Response+pushSupported"></a>

### httP2Response.pushSupported ⇒ <code>boolean</code>
Returns true if http/2 push is supported.

**Kind**: instance property of [<code>HTTP2Response</code>](#HTTP2Response)  

* * *

<a name="HTTP2Response+resolve"></a>

### httP2Response.resolve(path) ⇒ <code>string</code>
Resolve a given path against the incoming request server root.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 


* * *

<a name="HTTP2Response+push"></a>

### httP2Response.push(statusCode, path, contentType, content, [headers]) ⇒ <code>Promise</code>
Creates a new push stream as part of this response and pushes some
content to it. The path for the push should be resolved using the
resolve() function if it is relative.

Returns a Promise that will resolve when the push is complete.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  

| Param | Type | Default |
| --- | --- | --- |
| statusCode | <code>number</code> |  | 
| path | <code>string</code> |  | 
| contentType | <code>string</code> |  | 
| content | <code>Buffer</code> \| <code>string</code> |  | 
| [headers] | <code>Object</code> | <code>{}</code> | 


* * *

<a name="HTTP2Response+pushText"></a>

### httP2Response.pushText(statusCode, path, content, headers) ⇒ <code>Promise</code>
A push shortcut for text/plain content.

Returns a Promise that will resolve when the push is complete.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  

| Param | Type |
| --- | --- |
| statusCode | <code>number</code> | 
| path | <code>string</code> | 
| content | <code>\*</code> | 
| headers | <code>Object</code> | 


* * *

<a name="HTTP2Response+pushCSS"></a>

### httP2Response.pushCSS(statusCode, path, content, headers) ⇒ <code>Promise</code>
A push shortcut for text/css content.

Returns a Promise that will resolve when the push is complete.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  

| Param | Type |
| --- | --- |
| statusCode | <code>number</code> | 
| path | <code>string</code> | 
| content | <code>\*</code> | 
| headers | <code>Object</code> | 


* * *

<a name="HTTP2Response+pushHTML"></a>

### httP2Response.pushHTML(statusCode, path, content, headers) ⇒ <code>Promise</code>
A push shortcut for text/html content.

Returns a Promise that will resolve when the push is complete.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  

| Param | Type |
| --- | --- |
| statusCode | <code>number</code> | 
| path | <code>string</code> | 
| content | <code>\*</code> | 
| headers | <code>Object</code> | 


* * *

<a name="HTTP2Response+pushJSON"></a>

### httP2Response.pushJSON(statusCode, path, content, headers) ⇒ <code>Promise</code>
A push shortcut for application/json content.

If content is a string, it is assumed to be JSON already. If it is not
a string, it is converted to json by way of JSON.stringify().

Returns a Promise that will resolve when the push is complete.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  

| Param | Type |
| --- | --- |
| statusCode | <code>number</code> | 
| path | <code>string</code> | 
| content | <code>\*</code> | 
| headers | <code>Object</code> | 


* * *

<a name="HTTP2Response+pushServe"></a>

### httP2Response.pushServe(statusCode, path, contentType, filename, headers) ⇒ <code>Promise</code>
Creates a new push stream as part of this response and pushes the
content from the given filename to it. The path for the push should be
resolved using the resolve() function if it is relative.

The filename should be resolved using AwesomeServer.resolve() prior
to calling this function.

Returns a Promise that will resolve when the push is complete.

**Kind**: instance method of [<code>HTTP2Response</code>](#HTTP2Response)  
**Returns**: <code>Promise</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> | [description] |
| path | <code>string</code> | [description] |
| contentType | <code>string</code> | [description] |
| filename | <code>string</code> | [description] |
| headers | <code>Object</code> | [description] |


* * *

<a name="HTTP2Server"></a>

## HTTP2Server ⇐ [<code>AbstractServer</code>](#AbstractServer)
HTTP/2 implementation of AbstractServer, which is used by AwesomeServer
when AwesomeServer.addHTTP2Server() is used. This is basically a
wrapper around nodejs' http2 module.

**Kind**: global class  
**Extends**: [<code>AbstractServer</code>](#AbstractServer)  

* [HTTP2Server](#HTTP2Server) ⇐ [<code>AbstractServer</code>](#AbstractServer)
    * [new HTTP2Server(config)](#new_HTTP2Server_new)
    * [.running](#HTTP2Server+running) ⇒ <code>boolean</code>
    * [.original](#HTTP2Server+original) ⇒ <code>\*</code>
    * [.config](#AbstractServer+config) ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
    * [.start(handler)](#HTTP2Server+start) ⇒ <code>Promise</code>
    * [.stop()](#HTTP2Server+stop) ⇒ <code>Promise</code>
    * [.handleRequest(handler, request, response)](#HTTP2Server+handleRequest)


* * *

<a name="new_HTTP2Server_new"></a>

### new HTTP2Server(config)
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
  host: "localhost"
  port: 7080,
  key: null,
  cert: null,
  pfx: null
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


| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | An AwesomeConfig or plain Object. |


* * *

<a name="HTTP2Server+running"></a>

### httP2Server.running ⇒ <code>boolean</code>
Returns true if this server is started.

**Kind**: instance property of [<code>HTTP2Server</code>](#HTTP2Server)  
**Overrides**: [<code>running</code>](#AbstractServer+running)  

* * *

<a name="HTTP2Server+original"></a>

### httP2Server.original ⇒ <code>\*</code>
Returns the underlying, wrapped, nodejs http2 server.

**Kind**: instance property of [<code>HTTP2Server</code>](#HTTP2Server)  
**Overrides**: [<code>original</code>](#AbstractServer+original)  

* * *

<a name="AbstractServer+config"></a>

### httP2Server.config ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
Returns the passed in config object.

**Kind**: instance property of [<code>HTTP2Server</code>](#HTTP2Server)  

* * *

<a name="HTTP2Server+start"></a>

### httP2Server.start(handler) ⇒ <code>Promise</code>
Starts this server running and accepting requests. This effectively
creates the nodejs http2 server, and begins the listening process,
routing incoming requests to the provided handler.

AwesomeServer will call this method when AwesomeServer is started
and provides the handler it wants used for incoming requests.

This function returns a Promise that will resolve when the server
has started listening, or rejects if there is an error.

**Kind**: instance method of [<code>HTTP2Server</code>](#HTTP2Server)  
**Overrides**: [<code>start</code>](#AbstractServer+start)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="HTTP2Server+stop"></a>

### httP2Server.stop() ⇒ <code>Promise</code>
Stops the server running.

Returns a Promise that will resolve when the underlying server
has stopped.

**Kind**: instance method of [<code>HTTP2Server</code>](#HTTP2Server)  
**Overrides**: [<code>stop</code>](#AbstractServer+stop)  

* * *

<a name="HTTP2Server+handleRequest"></a>

### httP2Server.handleRequest(handler, request, response)
A wrapper function for the handler called by the underlying server
when a new request occurs. This handler is responsible for wrapping
the incoming request's request object and response object in a
HTTP2Request and HTTP2Response respectively. Finally, it calls
the handler AwesomeServer provided when it started the server.

**Kind**: instance method of [<code>HTTP2Server</code>](#HTTP2Server)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 
| request | <code>\*</code> | 
| response | <code>\*</code> | 


* * *

<a name="PushResponse"></a>

## PushResponse
Class for wrapping HTTP/2 push response streams.

Given some HTTP2 response, it is possible to push additional assets as part of
the outgoing stream. To do so, we create a PushResponse for each additional
asset.

A PushResponse is created by calling PushResponse.create() instead of
by using its constructor.

Once created the PushResponse can be used to write or stream data as need. Calling
end() of a PushResponse closes just that PushResponse, and not the parent HTTP/2
response.

**Kind**: global class  

* [PushResponse](#PushResponse)
    * [new PushResponse(parent, stream, [headers])](#new_PushResponse_new)
    * _instance_
        * [.parent](#PushResponse+parent) ⇒ [<code>HTTP2Response</code>](#HTTP2Response) \| [<code>PushResponse</code>](#PushResponse)
        * [.stream](#PushResponse+stream) ⇒ <code>\*</code>
        * [.headers](#PushResponse+headers) ⇒ <code>Object</code>
        * [.closed](#PushResponse+closed) ⇒ <code>boolean</code>
        * [.writeHead(statusCode, statusMessage, headers)](#PushResponse+writeHead)
        * [.write(data, encoding)](#PushResponse+write) ⇒ <code>Promise</code>
        * [.end(data, encoding)](#PushResponse+end) ⇒ <code>Promise</code>
        * [.pipeFrom()](#PushResponse+pipeFrom) ⇒ <code>Promise</code>
    * _static_
        * [.create(parent, headers)](#PushResponse.create) ⇒ <code>Promise</code>


* * *

<a name="new_PushResponse_new"></a>

### new PushResponse(parent, stream, [headers])
Constructor, but should not be used. use PushResponse.create() instead.


| Param | Type | Default |
| --- | --- | --- |
| parent | [<code>HTTP2Response</code>](#HTTP2Response) |  | 
| stream | <code>\*</code> |  | 
| [headers] | <code>Object</code> | <code>{}</code> | 


* * *

<a name="PushResponse+parent"></a>

### pushResponse.parent ⇒ [<code>HTTP2Response</code>](#HTTP2Response) \| [<code>PushResponse</code>](#PushResponse)
Returns the parent HTTP2 or PushResponse object.

**Kind**: instance property of [<code>PushResponse</code>](#PushResponse)  

* * *

<a name="PushResponse+stream"></a>

### pushResponse.stream ⇒ <code>\*</code>
Returns the underlying HTTP/2 stream.

**Kind**: instance property of [<code>PushResponse</code>](#PushResponse)  

* * *

<a name="PushResponse+headers"></a>

### pushResponse.headers ⇒ <code>Object</code>
Returns the headers object set by writeHead().

**Kind**: instance property of [<code>PushResponse</code>](#PushResponse)  

* * *

<a name="PushResponse+closed"></a>

### pushResponse.closed ⇒ <code>boolean</code>
Returns true if this stream has been closed, regardless of how it was closed.

**Kind**: instance property of [<code>PushResponse</code>](#PushResponse)  

* * *

<a name="PushResponse+writeHead"></a>

### pushResponse.writeHead(statusCode, statusMessage, headers)
Sets the status code and headers for the push response. This may only be
called once per push response and cannot be called after a write() or
and end() for this push response has been called.

Unlike write() and end() this does not return a Promise and does
not need to be preceeded by an await.

THe headers parameter should have the header keys as lower case.

**Kind**: instance method of [<code>PushResponse</code>](#PushResponse)  

| Param | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> |  |
| statusMessage | <code>string</code> \| <code>null</code> | optional. |
| headers | <code>Object</code> | optional. |


* * *

<a name="PushResponse+write"></a>

### pushResponse.write(data, encoding) ⇒ <code>Promise</code>
Writes a chunk of data to the push response with the given encoding.

Returns a Promise that will resolve when the write is complete.
It is always good practice to await a write().

**Kind**: instance method of [<code>PushResponse</code>](#PushResponse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> \| <code>string</code> |  |
| encoding | <code>string</code> | optional. Defaults to utf-8. |


* * *

<a name="PushResponse+end"></a>

### pushResponse.end(data, encoding) ⇒ <code>Promise</code>
Writes the passed in data to the push response with the given encoding
and then marks the push response finished.

Returns a Promise that will resolve when the end is complete.
It is always good practice to await an end().

**Kind**: instance method of [<code>PushResponse</code>](#PushResponse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> \| <code>string</code> |  |
| encoding | <code>string</code> | optional. Defaults to utf-8. |


* * *

<a name="PushResponse+pipeFrom"></a>

### pushResponse.pipeFrom() ⇒ <code>Promise</code>
Pipes the given Readable stream into the push response object. writeHead()
should be called prior to this.

When the pipeFrom() is complete, end() is called and the push response
is marked finished.

It is worth noting that pipeFrom() is different from nodejs Stream
pipe() method in that pipe() takes as an argument the writable stream.
pipeFrom() flips that and takes as an argument the readable stream.

Returns a Promise that will resolve when the end of the stream has
been sent and end() has been called. It is always good practice to
await pipeFrom().

**Kind**: instance method of [<code>PushResponse</code>](#PushResponse)  

* * *

<a name="PushResponse.create"></a>

### PushResponse.create(parent, headers) ⇒ <code>Promise</code>
Factory function. Use this instead of the constructor.

**Kind**: static method of [<code>PushResponse</code>](#PushResponse)  

| Param | Type |
| --- | --- |
| parent | [<code>HTTP2Response</code>](#HTTP2Response) | 
| headers | <code>Object</code> \| <code>null</code> | 


* * *

<a name="HTTPSRequest"></a>

## HTTPSRequest ⇐ [<code>HTTPSRequest</code>](#HTTPSRequest)
HTTPS Request wrapper class. Extends from HTTPRequest which in
turn extends from AbstractRequest.  Most of the
details is in HTTPRequest.

**Kind**: global class  
**Extends**: [<code>HTTPSRequest</code>](#HTTPSRequest)  

* * *

<a name="new_HTTPSRequest_new"></a>

### new HTTPSRequest(request)

| Param | Type |
| --- | --- |
| request | <code>IncomingRequest</code> | 


* * *

<a name="HTTPSResponse"></a>

## HTTPSResponse ⇐ [<code>HTTPSRequest</code>](#HTTPSRequest)
HTTPS Response wrapper class. Extends from HTTPRequest which in
turn extends from AbstractRequest.  Most of the
details is in HTTPRequest.

**Kind**: global class  
**Extends**: [<code>HTTPSRequest</code>](#HTTPSRequest)  

* * *

<a name="new_HTTPSResponse_new"></a>

### new HTTPSResponse(response)

| Param | Type |
| --- | --- |
| response | <code>ServerResponse</code> | 


* * *

<a name="HTTPSServer"></a>

## HTTPSServer ⇐ [<code>AbstractServer</code>](#AbstractServer)
HTTPS implementation of AbstractServer, which is used by AwesomeServer
when AwesomeServer.addHTTPSServer() is used. This is basically a
wrapper around nodejs' https module.

**Kind**: global class  
**Extends**: [<code>AbstractServer</code>](#AbstractServer)  

* [HTTPSServer](#HTTPSServer) ⇐ [<code>AbstractServer</code>](#AbstractServer)
    * [new HTTPSServer(config)](#new_HTTPSServer_new)
    * _instance_
        * [.running](#HTTPSServer+running) ⇒ <code>boolean</code>
        * [.original](#HTTPSServer+original) ⇒ <code>\*</code>
        * [.config](#AbstractServer+config) ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
        * [.start(handler)](#HTTPSServer+start) ⇒ <code>Promise</code>
        * [.stop()](#HTTPSServer+stop) ⇒ <code>Promise</code>
        * [.handleRequest(handler, request, response)](#HTTPSServer+handleRequest)
    * _static_
        * [.resolveCertConfig(value, [type])](#HTTPSServer.resolveCertConfig) ⇒ <code>string</code>


* * *

<a name="new_HTTPSServer_new"></a>

### new HTTPSServer(config)
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
  host: "localhost"
  port: 7080,
  key: null,
  cert: null,
  pfx: null
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


| Param | Type | Description |
| --- | --- | --- |
| config | <code>AwesomeConfig</code> \| <code>Object</code> | An AwesomeConfig or plain Object. |


* * *

<a name="HTTPSServer+running"></a>

### httpsServer.running ⇒ <code>boolean</code>
Returns true if this server is started.

**Kind**: instance property of [<code>HTTPSServer</code>](#HTTPSServer)  
**Overrides**: [<code>running</code>](#AbstractServer+running)  

* * *

<a name="HTTPSServer+original"></a>

### httpsServer.original ⇒ <code>\*</code>
Returns the underlying, wrapped, nodejs https server.

**Kind**: instance property of [<code>HTTPSServer</code>](#HTTPSServer)  
**Overrides**: [<code>original</code>](#AbstractServer+original)  

* * *

<a name="AbstractServer+config"></a>

### httpsServer.config ⇒ <code>AwesomeConfig</code> \| <code>Object</code>
Returns the passed in config object.

**Kind**: instance property of [<code>HTTPSServer</code>](#HTTPSServer)  

* * *

<a name="HTTPSServer+start"></a>

### httpsServer.start(handler) ⇒ <code>Promise</code>
Starts this server running and accepting requests. This effectively
creates the nodejs https server, and begins the listening process,
routing incoming requests to the provided handler.

AwesomeServer will call this method when AwesomeServer is started
and provides the handler it wants used for incoming requests.

This function returns a Promise that will resolve when the server
has started listening, or rejects if there is an error.

**Kind**: instance method of [<code>HTTPSServer</code>](#HTTPSServer)  
**Overrides**: [<code>start</code>](#AbstractServer+start)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 


* * *

<a name="HTTPSServer+stop"></a>

### httpsServer.stop() ⇒ <code>Promise</code>
Stops the server running.

Returns a Promise that will resolve when the underlying server
has stopped.

**Kind**: instance method of [<code>HTTPSServer</code>](#HTTPSServer)  
**Overrides**: [<code>stop</code>](#AbstractServer+stop)  

* * *

<a name="HTTPSServer+handleRequest"></a>

### httpsServer.handleRequest(handler, request, response)
A wrapper function for the handler called by the underlying server
when a new request occurs. This handler is responsible for wrapping
the incoming request's request object and response object in a
HTTPSRequest and HTTPSResponse respectively. Finally, it calls
the handler AwesomeServer provided when it started the server.

**Kind**: instance method of [<code>HTTPSServer</code>](#HTTPSServer)  

| Param | Type |
| --- | --- |
| handler | <code>function</code> | 
| request | <code>\*</code> | 
| response | <code>\*</code> | 


* * *

<a name="HTTPSServer.resolveCertConfig"></a>

### HTTPSServer.resolveCertConfig(value, [type]) ⇒ <code>string</code>
Static utility function for loading a certificate from a file system
or treating the passed string as the certificate.

**Kind**: static method of [<code>HTTPSServer</code>](#HTTPSServer)  

| Param | Type | Default |
| --- | --- | --- |
| value | <code>string</code> \| <code>buffer</code> |  | 
| [type] | <code>string</code> | <code>&quot;\&quot;certificate\&quot;&quot;</code> | 


* * *

<a name="RegExpMatcher"></a>

## RegExpMatcher ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Matches a Regular Expression against a given path.

**Kind**: global class  
**Extends**: [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* [RegExpMatcher](#RegExpMatcher) ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
    * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
    * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
    * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>


* * *

<a name="AbstractPathMatcher+toString"></a>

### regExpMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>RegExpMatcher</code>](#RegExpMatcher)  
**Overrides**: [<code>toString</code>](#AbstractPathMatcher+toString)  

* * *

<a name="AbstractPathMatcher+match"></a>

### regExpMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>RegExpMatcher</code>](#RegExpMatcher)  
**Overrides**: [<code>match</code>](#AbstractPathMatcher+match)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### regExpMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>RegExpMatcher</code>](#RegExpMatcher)  
**Overrides**: [<code>subtract</code>](#AbstractPathMatcher+subtract)  

* * *

<a name="StringContainsMatcher"></a>

## StringContainsMatcher ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Matches any portion of a string against a given path.

**Kind**: global class  
**Extends**: [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* [StringContainsMatcher](#StringContainsMatcher) ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
    * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
    * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
    * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>


* * *

<a name="AbstractPathMatcher+toString"></a>

### stringContainsMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>StringContainsMatcher</code>](#StringContainsMatcher)  
**Overrides**: [<code>toString</code>](#AbstractPathMatcher+toString)  

* * *

<a name="AbstractPathMatcher+match"></a>

### stringContainsMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>StringContainsMatcher</code>](#StringContainsMatcher)  
**Overrides**: [<code>match</code>](#AbstractPathMatcher+match)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### stringContainsMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>StringContainsMatcher</code>](#StringContainsMatcher)  
**Overrides**: [<code>subtract</code>](#AbstractPathMatcher+subtract)  

* * *

<a name="StringEndsWithMatcher"></a>

## StringEndsWithMatcher ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Matches the beginning portion of a string against a given path.

**Kind**: global class  
**Extends**: [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* [StringEndsWithMatcher](#StringEndsWithMatcher) ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
    * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
    * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
    * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>


* * *

<a name="AbstractPathMatcher+toString"></a>

### stringEndsWithMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>StringEndsWithMatcher</code>](#StringEndsWithMatcher)  
**Overrides**: [<code>toString</code>](#AbstractPathMatcher+toString)  

* * *

<a name="AbstractPathMatcher+match"></a>

### stringEndsWithMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>StringEndsWithMatcher</code>](#StringEndsWithMatcher)  
**Overrides**: [<code>match</code>](#AbstractPathMatcher+match)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### stringEndsWithMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>StringEndsWithMatcher</code>](#StringEndsWithMatcher)  
**Overrides**: [<code>subtract</code>](#AbstractPathMatcher+subtract)  

* * *

<a name="StringExactMatcher"></a>

## StringExactMatcher ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Matches the entire string against a given path.

**Kind**: global class  
**Extends**: [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* [StringExactMatcher](#StringExactMatcher) ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
    * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
    * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
    * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>


* * *

<a name="AbstractPathMatcher+toString"></a>

### stringExactMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>StringExactMatcher</code>](#StringExactMatcher)  
**Overrides**: [<code>toString</code>](#AbstractPathMatcher+toString)  

* * *

<a name="AbstractPathMatcher+match"></a>

### stringExactMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>StringExactMatcher</code>](#StringExactMatcher)  
**Overrides**: [<code>match</code>](#AbstractPathMatcher+match)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### stringExactMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>StringExactMatcher</code>](#StringExactMatcher)  
**Overrides**: [<code>subtract</code>](#AbstractPathMatcher+subtract)  

* * *

<a name="StringOrMatcher"></a>

## StringOrMatcher ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Matches the given path against at least 1 string PathMatcher expression.

**Kind**: global class  
**Extends**: [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* [StringOrMatcher](#StringOrMatcher) ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
    * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
    * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
    * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>


* * *

<a name="AbstractPathMatcher+toString"></a>

### stringOrMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>StringOrMatcher</code>](#StringOrMatcher)  
**Overrides**: [<code>toString</code>](#AbstractPathMatcher+toString)  

* * *

<a name="AbstractPathMatcher+match"></a>

### stringOrMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>StringOrMatcher</code>](#StringOrMatcher)  
**Overrides**: [<code>match</code>](#AbstractPathMatcher+match)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### stringOrMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>StringOrMatcher</code>](#StringOrMatcher)  
**Overrides**: [<code>subtract</code>](#AbstractPathMatcher+subtract)  

* * *

<a name="StringStartsWithMatcher"></a>

## StringStartsWithMatcher ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
Matches the beginning of a string against a given path.

**Kind**: global class  
**Extends**: [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)  

* [StringStartsWithMatcher](#StringStartsWithMatcher) ⇐ [<code>AbstractPathMatcher</code>](#AbstractPathMatcher)
    * [.toString()](#AbstractPathMatcher+toString) ⇒ <code>string</code>
    * [.match()](#AbstractPathMatcher+match) ⇒ <code>boolean</code>
    * [.subtract()](#AbstractPathMatcher+subtract) ⇒ <code>string</code>


* * *

<a name="AbstractPathMatcher+toString"></a>

### stringStartsWithMatcher.toString() ⇒ <code>string</code>
Returns the string version of this PathMatcher; used during logging.

**Kind**: instance method of [<code>StringStartsWithMatcher</code>](#StringStartsWithMatcher)  
**Overrides**: [<code>toString</code>](#AbstractPathMatcher+toString)  

* * *

<a name="AbstractPathMatcher+match"></a>

### stringStartsWithMatcher.match() ⇒ <code>boolean</code>
Returns true if the given path is a match to this specific PathMatcher.

**Kind**: instance method of [<code>StringStartsWithMatcher</code>](#StringStartsWithMatcher)  
**Overrides**: [<code>match</code>](#AbstractPathMatcher+match)  

* * *

<a name="AbstractPathMatcher+subtract"></a>

### stringStartsWithMatcher.subtract() ⇒ <code>string</code>
If a given path is a match to this specific PathMatcher, return the given
path minus the parts of the path that matched.  If the given path is not a
match, return the given path unchanged.

**Kind**: instance method of [<code>StringStartsWithMatcher</code>](#StringStartsWithMatcher)  
**Overrides**: [<code>subtract</code>](#AbstractPathMatcher+subtract)  

* * *


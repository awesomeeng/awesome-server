# AwesomeServer: HTTP/2 File Server Example

This examples provides a HTTP/2 version of the File Server example that takes advantage of HTTP/2 push capability.

## Key Concepts

 - Serve mutliple files with Serve File Routing.
 - Push specific resources using HTTP/2.
 - Fallback routing.

## Code Breakdown

### Server.js

```
const Log = require("AwesomeLog");
Log.init();
Log.start();
```

Optional section for starting AwesomeLog.

```
const AwesomeServer = require("AwesomeServer");
let server = new AwesomeServer();
```

Require and Instantiates AwesomeServer.

```
server.addHTTP2Server({
	host: "localhost",
	port: 7443,
	cert: server.resolve("./certificate.pub"), // load our cert relative to this Server.js file.
	key: server.resolve("./certificate.key") // load our key relative to this Server.js file.
});
server.start();
```

Adds a basic HTTP/2 Server to your AwesomeServer setup including indiciating a public/private key pair and starts it.

```
server.router.addServe("/hello/hello.css",server.resolve("./files/hello.css"));
```

Provides a fallback for obtaining the `/hello/hello.css` file in the event HTTP/2 doesn't accept the push.

```
server.router.addPushServe("/hello/*","/hello/hello.css",server.resolve("./files/hello.css"));
server.router.addPushServe("/hello","/hello/hello.css",server.resolve("./files/hello.css"));
```

Tells the router to automatically push `/hello/hello.css` for *any* request that matches `/hello` or `/hello/*`.

// Serve our basic html page at /hello. Because of the prior push rules, this will also include the pushed css file.
server.router.addServe("/hello",server.resolve("./files/index.html"));






















```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.
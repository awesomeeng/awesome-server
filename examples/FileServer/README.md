# AwesomeServer: File Server Example

This examples demonstrates how to write a very bssic HTTP Server using Serve File Routing.

## Key Concepts

 - Serve mutliple files with Serve File Routing.

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
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
```

Adds a basic HTTP Server to your AwesomeServer setup.

```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.

```
server.router.addServeDirectory("/hello",AwesomeServer.resolveRelativeToModule(module,"./files"));
```

Routes `/hello` or `/hello/` or `/hello/*` to files in the `./files` directory. Its worth nothing that for `/hello` and `/hello/` will also add the default `index.html`.

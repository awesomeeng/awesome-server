# AwesomeServer: Basic Server Example

A brief example of setting up a basic AwesomeServer server with a very simple route.

```
const Log = require("AwesomeLog");
Log.init();
Log.start();
```

Optional section for starting AwesomeLog.

```
const AwesomeServer = require("../../src/AwesomeServer");
```

Require AwesomeServer. (Your code would probably do this as `require("AwesomeServer")` instead of using the relative path.

```
let server = new AwesomeServer();
```

Instantiates AwesomeServer.

```
server.addHTTPServer({
	hostname: "localhost",
	port: 7080
});
```

Adds a basic HTTP Server to your AwesomeServer setup.

```
server.router.add("*","/hello",async (path,request,response)=>{
	await response.writeText("Hello world.");
});
```

Implement the most simple of routes that maps `/hello` to this response.

```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.

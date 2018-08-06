# AwesomeServer: Basic Server Example

A brief example of setting up a basic AwesomeServer server with a very simple route.

## Key Concepts

 - Instiating AwesomeServer
 - Basic Routing of a method/path to a function.

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
	host: "localhost",
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

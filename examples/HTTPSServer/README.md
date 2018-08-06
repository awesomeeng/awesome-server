# AwesomeServer: HTTPS Server Example

This examples demonstrates how to write stand-alone controller classes and route to them.

## Key Concepts

 - Basic configuration of an HTTPS Server.
 - Basic routing.

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
server.addHTTPSServer({
	hostname: "localhost",
	port: 7443,
	cert: AwesomeServer.resolveRelativeToModule(module,"./certificate.pub"), // load our cert relative to this Server.js file.
	key: AwesomeServer.resolveRelativeToModule(module,"./certificate.key") // load our key relative to this Server.js file.
});
```

Adds a basic HTTPS Server to your AwesomeServer setup including indiciating a public/private key pair.

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

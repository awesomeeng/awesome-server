# AwesomeServer: Controller Directory Example

This examples demonstrates how to use Controller Directory Routing to work with many controllers.

## Key Concepts

 - Writing a Controller Class.
 - Routing to Controllers using Controller Directory Routing.
 - Changing the default prefix.

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
server.router.prefix = "/api";
```

Changes the default top-level prefix for the router, so all requests will be required to start with "/api".

```
server.router.addControllerDirectory(server.resolve("./controllers"));
```

Maps all of the controllers found in `./controllers` to the `/api` path. So `./controllers/one.js` will be mapped to `/api/one` and so on.  Sub-directories are also recursed and mapped so `./controllers/three/one.js` ends up mapped to ``/api/three/one`.

```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.

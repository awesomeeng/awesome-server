# AwesomeServer: Basic Controller Example

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
const AbstractController = AwesomeServer.AbstractController;
class MyController extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller "+path);
	}

	async post(path,request,response) {
		await response.writeText("Controllers are awesome.");
	}
}
```

Require AbstractController and create a sub-class out of it.

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
server.router.addController("/hello",new MyController());;
```

Create an instance of MyController and pass it to the router for `/hello`.

```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.

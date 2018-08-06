# AwesomeServer: Controller Classes Example

This examples demonstrates how to write stand-alone controller classes and route to them.

## Key Concepts

 - Writing a Controller Class.
 - Routing to Controllers using Controller File Routing.

## Code Breakdown

### ControllerOne.js & ControllerTwo.js

```
const AwesomeServer = require("AwesomeServer");
const AbstractController = AwesomeServer.AbstractController;
```

Require AwesomeServer and AbstractController.

```
class ControllerOne extends AbstractController {
	constructor() {
		super();
	}

	async get(path,request,response) {
		await response.writeText("Controller One says Hello!");
	}
}
```

Creates a controller that will handle GET requests.

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
server.router.addControllerFile("/one",AwesomeServer.resolveRelativeToModule(module,"./ControllerOne"));
server.router.addControllerFile("/two",AwesomeServer.resolveRelativeToModule(module,"./ControllerTwo"));
```
Route `/one` to ControllerOne.js and `/two` to ControllerTwo.js.

```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.

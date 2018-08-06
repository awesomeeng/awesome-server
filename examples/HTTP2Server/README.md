# AwesomeServer: HTTP/2 Server Example

This examples demonstrates how to write stand-alone controller classes and route to them.

## Key Concepts

 - Basic Routing
 - HTTP/2 Push responses

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
	cert: AwesomeServer.resolveRelativeToModule(module,"./certificate.pub"), // load our cert relative to this Server.js file.
	key: AwesomeServer.resolveRelativeToModule(module,"./certificate.key") // load our key relative to this Server.js file.
});
```

Adds a basic HTTP/2 Server to your AwesomeServer setup including indiciating a public/private key pair.

```
server.router.add("*","/hello",(path,request,response)=>{
	return new Promise(async (resolve,reject)=>{
		try {
			await response.push("/index1.css","text/css","p { font-size:48px; color: red; }");
			await response.push("/index2.css","text/css","p { font-weight: bold; }");
			setTimeout(async ()=>{
				await response.writeHTML("<html><head><link rel='stylesheet' type='text/css' href='index1.css'><link rel='stylesheet' type='text/css' href='index2.css'></head><body><p>Hello world.</p></body></html>");
				await response.end();

				resolve();
			},2000);
		}
		catch (ex) {
			return reject(ex);
		}
	});

});
```

Implement the most simple of routes that maps `/hello` to this response. In addition to responding to the request with a block of HTML, this also uses HTTP/2 Push to pre-load the `index.css` and `index2.css` files for the browser.

```
server.start();
```

Starts AwesomeServer, which in turn starts listening on localhost:7080.

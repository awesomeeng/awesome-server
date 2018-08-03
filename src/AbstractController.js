// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

class AbstractController {
	constructor() {
	}

	/**
	 * Executed before each individual request is handled. This will execute ONLY IF the
	 * request method is implemented in the controller.
	 *
	 * May return a promise or nothing. If a promise is returned, the promise is awaited
	 * before moving the the handler function.
	 *
	 * @return {[type]} [description]
	 */
	before(/*path,request,response*/) {
		// to be implemented by extending classes if needed.
	}

	/**
	 * Executed after each individual request is handled. This will execute ONLY IF the
	 * request method is implemented in the controller.
	 *
	 * May return a promise or nothing. If a promise is returned, the promise is awaited
	 * before the final resolve.
	 *
	 * @return {[type]} [description]
	 */
	after(/*path,request,response*/) {
		// to be implemented by extending classes if needed.
	}

	/**
	 * Executed only if a request method is not implemented in the controller. Can be used
	 * as a kind of catch-all for requests.
	 *
	 * May return a promise or nothing. If a promise is returned, the promise is awaited
	 * before the final resolve.
	 *
	 * @return {[type]} [description]
	 */
	any(/*path,request,response*/) {
		// to be implemented by extending classes if needed.
	}

	/**
	 * The handler function which is executed for each request entering this controller.
	 * The handler function takes care of caling before(), any matching request handler
	 * for a given request method, and after(). If no matching request handler is
	 * found, before(), any(), and after(), are called.
	 *
	 * For any given request that is handled by this controller, the handler function
	 * will attempt to find an appropriate handle function for a given request method.
	 * It does so by looking for an all lowercase version of the method, or an all
	 * uppsercase version of the method, or a
	 * "handle<UpperCaseFirstCharacter><LowerCaseRemaining>" method. So for a GET
	 * method it would try, in the following order...
	 *
	 * 		get()
	 * 		GET()
	 * 		handleGet()
	 *
	 * The first matching function wins.
	 *
	 * The handling function will be called with the signature
	 *
	 * 		(path,request,response)
	 *
	 * For example,
	 *
	 * 		get(path,request,response)
	 *
	 * The handling function may return a promise. If it does so, this
	 * handle function will await for the promise to resolve.
	 *
	 * Generally speaking, it is probably best not to overload this function but
	 * to use before(), after(), any(), or the specific request method handler.
	 *
	 * @param  {[type]} request  [description]
	 * @param  {[type]} response [description]
	 * @return {[type]}          [description]
	 */
	handler(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				let method = request.method.toLowerCase();

				let prom;
				let f = method && (this[method.toLowerCase()] || this[method.toUpperCase()] || this["handle"+method.slice(0,1).toUpperCase()+method.slice(1).toLowerCase()]) || null;
				if (f && f instanceof Function) {

					prom = this.before(path,request,response);
					if (prom instanceof Promise) prom = await prom;

					prom = f.call(this,path,request,response);
					if (prom instanceof Promise) prom = await prom;

					prom = this.after(path,request,response);
					if (prom instanceof Promise) prom = await prom;
				}
				else {
					prom = this.before(path,request,response);
					if (prom instanceof Promise) prom = await prom;

					prom = this.any(path,request,response);
					if (prom instanceof Promise) prom = await prom;

					prom = this.after(path,request,response);
					if (prom instanceof Promise) prom = await prom;
				}

				resolve(); // will 404 in AwesomeServer if nothing else handles
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = AbstractController;

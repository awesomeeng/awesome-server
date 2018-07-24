// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $HANDLER_REFERENCE = Symbol("handler_reference");

class AbstractController {
	constructor() {
		this[$HANDLER_REFERENCE] = this.handler.bind(this);
	}

	get handlerRef() {
		return this[$HANDLER_REFERENCE];
	}

	handler(request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				let method = request.method.toLowerCase();
				let path = request.path;

				let f = method && (this[method.toLowerCase()] || this[method.toUpperCase()] || this["handle"+method.slice(0,1).toUpperCase()+method.slice(1).toLowerCase()]) || null;
				if (f && f instanceof Function) {
					let prom = f.call(this,path,request,response);
					if (prom instanceof Promise) prom = await prom;
					resolve();
				}

				resolve(); // will 404 in AwesomeServer if nothing else handles.
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

}

module.exports = AbstractController;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $ORIGINAL = Symbol("original");

const $CONTENT = Symbol("content");

class AbstractRequest {
	constructor(originalRequest) {
		this[$ORIGINAL] = originalRequest;
	}

	get original() {
		return this[$ORIGINAL];
	}

	get origin() {
		throw new Error("To be implemented by subclass.");
	}

	get method() {
		throw new Error("To be implemented by subclass.");
	}

	get url() {
		throw new Error("To be implemented by subclass.");
	}

	get path() {
		throw new Error("To be implemented by subclass.");
	}

	get query() {
		throw new Error("To be implemented by subclass.");
	}

	get querystring() {
		throw new Error("To be implemented by subclass.");
	}

	get headers() {
		throw new Error("To be implemented by subclass.");
	}

	get contentType() {
		throw new Error("To be implemented by subclass.");
	}

	get contentEncoding() {
		throw new Error("To be implemented by subclass.");
	}

	get useragent() {
		throw new Error("To be implemented by subclass.");
	}

	read() {
		if (this[$CONTENT]) return Promise.resolve(this[$CONTENT]);

		return new Promise((resolve,reject)=>{
			try {
				let buf = Buffer.alloc(0);
				this.original.on("data",(chunk)=>{
					if (!chunk) return;
					buf = Buffer.concat([buf,chunk]);
				});
				this.original.on("end",()=>{
					this[$CONTENT] = buf;
					resolve(buf);
				});
				this.original.resume();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	readText(encoding="utf-8") {
		return new Promise(async (resolve,reject)=>{
			try {
				let content = await this.read();
				resolve(content.toString(encoding));
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	readJSON() {
		return new Promise(async (resolve,reject)=>{
			try {
				let content = await this.read();
				resolve(JSON.parse(content));
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = AbstractRequest;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $ORIGINAL = Symbol("original");

class AbstractRequest {
	constructor(original) {
		this[$ORIGINAL] = original;
	}

	get original() {
		return this[$ORIGINAL];
	}

	get origin() {
		throw new Error("To be implemented by subclass.");
	}

	get hostname() {
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
		return this.content;
	}

	readJSON() {
		return new Promise(async (resolve,reject)=>{
			try {
				let content = await this.read;
				resolve(JSON.parse(content));
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = AbstractRequest;

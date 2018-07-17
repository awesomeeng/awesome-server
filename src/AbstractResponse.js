// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $ORIGINAL = Symbol("original");

class AbstractResponse {
	constructor(original) {
		this[$ORIGINAL] = original;
		console.log(original);
	}

	get original() {
		return this[$ORIGINAL];
	}

	get complete() {
		throw new Error("To be implemented by subclass.");
	}

	get contentEncoding() {
		throw new Error("To be implemented by subclass.");
	}

	set contentEncoding(s) {
		throw new Error("To be implemented by subclass.");
	}

	get contentType() {
		throw new Error("To be implemented by subclass.");
	}

	set contentType(s) {
		throw new Error("To be implemented by subclass.");
	}

	get statusCode() {
		throw new Error("To be implemented by subclass.");
	}

	set statusCode(n) {
		throw new Error("To be implemented by subclass.");
	}

	writeHead(/*statusCode,statusMessage,headers*/) {
		throw new Error("To be implemented by subclass.");
	}

	write(/*data*/) {
		throw new Error("To be implemented by subclass.");
	}

	end(/*data*/) {
		throw new Error("To be implemented by subclass.");
	}

	writeHeaders() {
		throw new Error("To be implemented by subclass.");
	}

	writeJSON(json) {
		this.writeHead("application/json");
		if (typeof json!=="string") json = JSON.stringify(json);
		this.write(json);
		this.end();
	}

	writeError(statusCode,message) {
		this.writeHead(statusCode,message,{
			"Content-Type": "text/plain"
		});
		this.write(message);
		this.end();
	}

}

module.exports = AbstractResponse;

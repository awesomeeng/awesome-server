// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $ORIGINAL = Symbol("original");

class AbstractResponse {
	constructor(original) {
		this[$ORIGINAL] = original;
		// console.log(original);
	}

	get original() {
		return this[$ORIGINAL];
	}

	get finished() {
		throw new Error("To be implemented by subclass.");
	}

	get statusCode() {
		throw new Error("To be implemented by subclass.");
	}

	get contentEncoding() {
		throw new Error("To be implemented by subclass.");
	}

	get contentType() {
		throw new Error("To be implemented by subclass.");
	}

	writeHead(/*statusCode,statusMessage,headers*/) {
		throw new Error("To be implemented by subclass.");
	}

	write(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
	}

	end(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
	}

	writeJSON(json) {
		this.writeHead(200,null,{
			"Content-Type":"application/json"
		});
		if (typeof json!=="string") json = JSON.stringify(json);
		this.write(json);
		this.end();
	}

	writeText(text) {
		this.writeHead(200,null,{
			"Content-Type":"text/plain"
		});
		this.write(text);
		this.end();
	}

	writeHTML(html) {
		this.writeHead(200,null,{
			"Content-Type":"text/html"
		});
		this.write(html);
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

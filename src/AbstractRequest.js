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

	get url() {
		throw new Error("To be implemented by subclass.");
	}

	get method() {
		throw new Error("To be implemented by subclass.");
	}

	get path() {
		throw new Error("To be implemented by subclass.");
	}

	get headers() {
		throw new Error("To be implemented by subclass.");
	}

	get content() {
		throw new Error("To be implemented by subclass.");
	}

	get useragent() {
		throw new Error("To be implemented by subclass.");
	}
}

module.exports = AbstractRequest;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

class AbstractServer {
	constructor() {
	}

	get running() {
		throw new Error("To be implemented by subclass.");
	}

	get config() {
		throw new Error("To be implemented by subclass.");
	}

	get underlyingServer() {
		throw new Error("To be implemented by subclass.");
	}

	start() {
		throw new Error("To be implemented by subclass.");
	}

	stop() {
		throw new Error("To be implemented by subclass.");
	}
}

module.exports = AbstractServer;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $CONFIG = Symbol("config");

class AbstractServer {
	constructor(config) {
		this[$CONFIG] = config;
	}

	get config() {
		return this[$CONFIG];
	}

	get running() {
		throw new Error("To be implemented by subclass.");
	}

	get original() {
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

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $PATH = Symbol("path");

/**
 * Matches the beginning of a string against a given path.
 *
 * @extends AbstractPathMatcher
 */
class StringStartsWithMatcher extends AbstractPathMatcher {
	constructor(path) {
		super();

		this[$PATH] = path;
	}

	get path() {
		return this[$PATH];
	}

	toString() {
		return "\""+this.path+"\"";
	}

	match(path) {
		return path.startsWith(this.path.slice(0,-1));
	}

	subtract(path) {
		if (!this.match(path)) return path;
		return path.slice(this.path.length-1);
	}
}

module.exports = StringStartsWithMatcher;

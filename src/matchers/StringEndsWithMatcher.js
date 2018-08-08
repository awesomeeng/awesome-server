// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $PATH = Symbol("path");

class StringEndsWithMatcher extends AbstractPathMatcher {
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
		return path.endsWith(this.path.slice(1));
	}

	subtract(path) {
		if (!this.match(path)) return path;
		return path.slice(0,-(this.path.length-1));
	}
}

module.exports = StringEndsWithMatcher;

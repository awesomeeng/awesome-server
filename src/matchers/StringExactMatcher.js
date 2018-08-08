// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $PATH = Symbol("path");

class StringExactMatcher extends AbstractPathMatcher {
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
		return this.path===path;
	}

	subtract(path) {
		if (!this.match(path)) return path;
		return "";
	}
}

module.exports = StringExactMatcher;

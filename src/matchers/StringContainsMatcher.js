// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $PATH = Symbol("path");

class StringContainsMatcher extends AbstractPathMatcher {
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
		return path.indexOf(this.path.slice(1,-1))>-1;
	}

	subtract(path) {
		if (!this.match(path)) return path;

		let start = path.indexOf(this.path.slice(1,-1));
		let end = start+ this.path.length-2;
		return path.slice(0,start)+path.slice(end);
	}
}

module.exports = StringContainsMatcher;

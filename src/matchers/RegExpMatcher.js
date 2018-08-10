// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $PATH = Symbol("path");

/**
 * Matches a Regular Expression against a given path.
 *
 * @extends AbstractPathMatcher
 */
class RegExpMatcher extends AbstractPathMatcher {
	constructor(path) {
		if (!path) throw new Error("Missing path.");
		if (!(path instanceof RegExp)) throw new Error("Invalid path.");

		super();

		this[$PATH] = path;
	}

	get path() {
		return this[$PATH];
	}

	toString() {
		return "/"+this.path.source+"/"+this.path.flags;
	}

	match(path) {
		return path.match(this.path);
	}

	subtract(path) {
		let match = path.match(this.path);
		if (!match) return path;
		return path.slice(0,match.index)+path.slice(match.index+match[0].length);
	}
}

module.exports = RegExpMatcher;

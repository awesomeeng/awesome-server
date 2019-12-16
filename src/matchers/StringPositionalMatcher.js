// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $PATTERN = Symbol("pattern");
const $REGEX = Symbol("regex");

/**
 * Matches the entire string against a given path.
 *
 * @extends AbstractPathMatcher
 */
class StringPositionalMatcher extends AbstractPathMatcher {
	constructor(pattern) {
		super();

		this[$PATTERN] = pattern;
		this[$REGEX] = new RegExp("^"+pattern.replace(/:([A-Za-z0-9_]+)/g,"(?<$1>[^/]+?)")+"$");
	}

	get pattern() {
		return this[$PATTERN];
	}

	toString() {
		return "\""+this.pattern+"\"";
	}

	match(path) {
		let match = this[$REGEX].exec(path);
		if (!match) return false;
		return Object.assign({},match.groups);
	}

	subtract(path) {
		if (!this.match(path)) return path;
		return "";
	}
}

module.exports = StringPositionalMatcher;

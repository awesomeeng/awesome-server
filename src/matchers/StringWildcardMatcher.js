// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

/**
 * Matches the any path.
 *
 * @extends AbstractPathMatcher
 */
class StringWildcardMatcher extends AbstractPathMatcher {
	constructor() {
		super();
	}

	toString() {
		return "\""+this.path+"\"";
	}

	match(/*path*/) {
		return true;
	}

	subtract(path) {
		return path;
	}
}

module.exports = StringWildcardMatcher;

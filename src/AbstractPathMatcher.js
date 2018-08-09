// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

/**
 * Describes the required shape of a PathMatcher used by AwesomeServer
 * for determining if an incoming request path matches a specific router.
 *
 * The following functions are required to be implemented by
 * extending classes:
 *
 * 		match()
 * 		subtract()
 * 		toString()
 */
class AbstractPathMatcher {
	/**
	 * Constructor.
	 * @constructor
	 */
	constructor() {
	}

	/**
	 * Returns the string version of this PathMatcher; used during logging.
	 *
	 * @return {string}
	 */
	toString() {
		throw new Error("Must be implemented by sub-class.");
	}

	/**
	 * Returns true if the given path is a match to this specific PathMatcher.
	 *
	 * @return {boolean}
	 */
	match(/*path*/) {
		throw new Error("Must be implemented by sub-class.");
	}

	/**
	 * If a given path is a match to this specific PathMatcher, return the given
	 * path minus the parts of the path that matched.  If the given path is not a
	 * match, return the given path unchanged.
	 *
	 * @return {string}
	 */
	subtract(/*path*/) {
		throw new Error("Must be implemented by sub-class.");
	}

	/**
	 * Used by AwesomeServer to return an instance of the correct PathMatcher based
	 * on the path argument passed in. This is used extensively in routing.
	 *
	 * @param  {(string|RegExp|AbstractPathMatcher)}  path
	 * @return {AbstractPathMatcher}
	 */
	static getMatcher(path) {
		let type = typeof path;
		if (!path) throw new Error("Missing path.");
		else if (path instanceof AbstractPathMatcher) return path;
		else if (path instanceof RegExp) return new (require("./matchers/RegExpMatcher"))(path);
		else if (type==="string" && path.indexOf("|")>-1) return new (require("./matchers/StringOrMatcher"))(path);
		else if (type==="string" && path.endsWith("*") && !path.startsWith("*")) return new (require("./matchers/StringStartsWithMatcher"))(path);
		else if (type==="string" && path.startsWith("*") && !path.endsWith("*")) return new (require("./matchers/StringEndsWithMatcher"))(path);
		else if (type==="string" && path.startsWith("*") && path.endsWith("*")) return new (require("./matchers/StringContainsMatcher"))(path);
		else if (type==="string") return new (require("./matchers/StringExactMatcher"))(path);
		else throw new Error("Invalid path.");
	}
}

module.exports = AbstractPathMatcher;

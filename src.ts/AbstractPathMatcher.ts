// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

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
export abstract class AbstractPathMatcher {
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
	abstract toString(): string;

	/**
	 * Returns true if the given path is a match to this specific PathMatcher.
	 *
	 * @param {string} path The path to match against
	 * @return {boolean}
	 */
	abstract match(path: string): boolean;

	/**
	 * If a given path is a match to this specific PathMatcher, return the given
	 * path minus the parts of the path that matched.  If the given path is not a
	 * match, return the given path unchanged.
	 *
	 * @param {string} path The path to subtract from
	 * @return {string}
	 */
	abstract subtract(path: string): string;

	/**
	 * Used by AwesomeServer to return an instance of the correct PathMatcher based
	 * on the path argument passed in. This is used extensively in routing.
	 *
	 * @param  {string|RegExp|AbstractPathMatcher}  path
	 * @return {AbstractPathMatcher}
	 */
	static getMatcher(path: string | RegExp | AbstractPathMatcher): AbstractPathMatcher {
		const type = typeof path;
		if (!path) throw new Error("Missing path.");
		// If a matcher, use that.
		else if (path instanceof AbstractPathMatcher) return path;
		// If a regex, use that.
		else if (path instanceof RegExp) {
			const RegExpMatcher = require("./matchers/RegExpMatcher");
			return new RegExpMatcher(path);
		}
		// If a OR condition, use that.
		else if (type==="string" && path.indexOf("|")>-1) {
			const StringOrMatcher = require("./matchers/StringOrMatcher");
			return new StringOrMatcher(path);
		}
		// IF a wildcard, use that
		else if (type==="string" && path==="*") {
			const StringWildcardMatcher = require("./matchers/StringWildcardMatcher");
			return new StringWildcardMatcher(path);
		}
		else if (type==="string" && path.endsWith("*") && !path.startsWith("*")) {
			const StringStartsWithMatcher = require("./matchers/StringStartsWithMatcher");
			return new StringStartsWithMatcher(path);
		}
		else if (type==="string" && path.startsWith("*") && !path.endsWith("*")) {
			const StringEndsWithMatcher = require("./matchers/StringEndsWithMatcher");
			return new StringEndsWithMatcher(path);
		}
		else if (type==="string" && path.startsWith("*") && path.endsWith("*")) {
			const StringContainsMatcher = require("./matchers/StringContainsMatcher");
			return new StringContainsMatcher(path);
		}
		// If positional params, use that.
		else if (type==="string" && path.indexOf(":")>-1) {
			const StringPositionalMatcher = require("./matchers/StringPositionalMatcher");
			return new StringPositionalMatcher(path);
		}
		// finally, use an exact string match.
		else if (type==="string") {
			const StringExactMatcher = require("./matchers/StringExactMatcher");
			return new StringExactMatcher(path);
		}
		else throw new Error("Invalid path.");
	}
}

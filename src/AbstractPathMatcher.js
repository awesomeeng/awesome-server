// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

class AbstractPathMatcher {
	constructor() {
	}

	toString() {
		throw new Error("Must be implemented by sub-class.");
	}

	match(/*path*/) {
		throw new Error("Must be implemented by sub-class.");
	}

	subtract(/*path*/) {
		throw new Error("Must be implemented by sub-class.");
	}

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

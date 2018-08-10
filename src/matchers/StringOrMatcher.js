// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractPathMatcher = require("../AbstractPathMatcher");

const $MATCHERS = Symbol("matchers");

/**
 * Matches the given path against at least 1 string PathMatcher expression.
 *
 * @extends AbstractPathMatcher
 */
class StringOrMatcher extends AbstractPathMatcher {
	constructor(path) {
		super();

		this[$MATCHERS] = path.split(/\|/).map((path)=>{
			return AbstractPathMatcher.getMatcher(path);
		});
	}

	get matchers() {
		return this[$MATCHERS];
	}

	toString() {
		let s = this.matchers.map((matcher)=>{
			return matcher.toString();
		}).join("|").replace(/"/g,"");
		return s && "\""+s+"\"" || "";
	}

	match(path) {
		return this.matchers.some((matcher)=>{
			return matcher.match(path);
		});
	}

	subtract(path) {
		if (!this.match(path)) return path;
		let reduced = this.matchers.reduce((answer,matcher)=>{
			if (answer!==undefined) return answer;
			if (matcher.match(path)) return matcher.subtract(path);
			return undefined;
		},undefined);
		if (reduced===undefined) return path;
		return reduced;
	}
}

module.exports = StringOrMatcher;

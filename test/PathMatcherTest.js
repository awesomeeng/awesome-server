// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AbstractPathMatcher = require("../src/AbstractPathMatcher");
const RegExpMatcher = require("../src/matchers/RegExpMatcher");
const StringOrMatcher = require("../src/matchers/StringOrMatcher");
const StringStartsWithMatcher = require("../src/matchers/StringStartsWithMatcher");
const StringEndsWithMatcher = require("../src/matchers/StringEndsWithMatcher");
const StringContainsMatcher = require("../src/matchers/StringContainsMatcher");
const StringExactMatcher = require("../src/matchers/StringExactMatcher");
const StringPositionalMatcher = require("../src/matchers/StringPositionalMatcher");

const CustomMatcher = (class CustomMatcher extends AbstractPathMatcher {});

describe("PathMatcher",function(){
	it("getMatcher",function(){
		assert(AbstractPathMatcher.getMatcher(/asdf/) instanceof RegExpMatcher);
		assert(AbstractPathMatcher.getMatcher("/abc|/xyz") instanceof StringOrMatcher);
		assert(AbstractPathMatcher.getMatcher("/asdf") instanceof StringExactMatcher);
		assert(AbstractPathMatcher.getMatcher("*/asdf") instanceof StringEndsWithMatcher);
		assert(AbstractPathMatcher.getMatcher("/asdf/*") instanceof StringStartsWithMatcher);
		assert(AbstractPathMatcher.getMatcher("*/asdf/*") instanceof StringContainsMatcher);
		assert(AbstractPathMatcher.getMatcher("/asdf/:id") instanceof StringPositionalMatcher);
		assert(AbstractPathMatcher.getMatcher("/:abc/:id|/xyz/:id") instanceof StringOrMatcher);
		assert(AbstractPathMatcher.getMatcher(new CustomMatcher()) instanceof CustomMatcher);

		// ensure that wildcard matches win over positional matchers.
		assert(AbstractPathMatcher.getMatcher("*/asdf/:id") instanceof StringEndsWithMatcher);
		assert(AbstractPathMatcher.getMatcher("/asdf/:id/*") instanceof StringStartsWithMatcher);
		assert(AbstractPathMatcher.getMatcher("*/asdf/:id/*") instanceof StringContainsMatcher);

	});

	it("StringExactMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher("/test");

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof StringExactMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(matcher.match("/test"));
		assert(!matcher.match("/test/"));
		assert(!matcher.match("/test/abc/xyz"));
		assert(!matcher.match("/abc/test/xyz"));
		assert(!matcher.match("/abc/xyz/test"));

		assert.strictEqual(matcher.toString(),"\"/test\"");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"");
		assert.equal(matcher.subtract("/test/"),"/test/");
		assert.equal(matcher.subtract("/test/abc/xyz"),"/test/abc/xyz");
		assert.equal(matcher.subtract("/abc/test/xyz"),"/abc/test/xyz");
		assert.equal(matcher.subtract("/abc/xyz/test"),"/abc/xyz/test");
	});

	it("StringPositionalMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher("/test/:a/:b/:c");
		let match;

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof StringPositionalMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(!matcher.match("/test"));
		assert(!matcher.match("/test/1"));
		assert(!matcher.match("/test/1/2"));
		assert(matcher.match("/test/1/2/3"));
		assert(!matcher.match("/test/1/2/3/4"));
		assert(!matcher.match("/test/1/2/3/4/5"));
		assert(!matcher.match("/test/12345"));
		assert(!matcher.match("/test/1,2,3"));
		assert(!matcher.match("/test/1,2,3,4,5"));

		assert.strictEqual(matcher.toString(),"\"/test/:a/:b/:c\"");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"/test");
		assert.equal(matcher.subtract("/test/1"),"/test/1");
		assert.equal(matcher.subtract("/test/1/2"),"/test/1/2");
		assert.equal(matcher.subtract("/test/1/2/3"),"");
		assert.equal(matcher.subtract("/test/1/2/3/4"),"/test/1/2/3/4");
		assert.equal(matcher.subtract("/test/1/2/3/4/5"),"/test/1/2/3/4/5");

		match = matcher.match("/test/1/2/3");
		assert(match);
		assert.deepStrictEqual(match,{
			a: "1",
			b: "2",
			c: "3"
		});

		match = matcher.match("/test/1/2/3/4");
		assert(!match);
	});

	it("StringStartsWithMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher("/test/*");

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof StringStartsWithMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(!matcher.match("/test"));
		assert(matcher.match("/test/"));
		assert(matcher.match("/test/abc/xyz"));
		assert(!matcher.match("/abc/test/xyz"));
		assert(!matcher.match("/abc/xyz/test"));

		assert.strictEqual(matcher.toString(),"\"/test/*\"");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"/test");
		assert.equal(matcher.subtract("/test/"),"");
		assert.equal(matcher.subtract("/test/abc/xyz"),"abc/xyz");
		assert.equal(matcher.subtract("/abc/test/xyz"),"/abc/test/xyz");
		assert.equal(matcher.subtract("/abc/xyz/test"),"/abc/xyz/test");
	});

	it("StringEndsWithMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher("*/test/");

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof StringEndsWithMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(!matcher.match("/test"));
		assert(matcher.match("/test/"));
		assert(!matcher.match("/test/abc/xyz"));
		assert(!matcher.match("/abc/test/xyz"));
		assert(!matcher.match("/abc/xyz/test"));
		assert(matcher.match("/abc/xyz/test/"));

		assert.strictEqual(matcher.toString(),"\"*/test/\"");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"/test");
		assert.equal(matcher.subtract("/test/"),"");
		assert.equal(matcher.subtract("/test/abc/xyz"),"/test/abc/xyz");
		assert.equal(matcher.subtract("/abc/test/xyz"),"/abc/test/xyz");
		assert.equal(matcher.subtract("/abc/xyz/test"),"/abc/xyz/test");
		assert.equal(matcher.subtract("/abc/xyz/test/"),"/abc/xyz");
	});

	it("StringContainsMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher("*/test/*");

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof StringContainsMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(!matcher.match("/test"));
		assert(matcher.match("/test/"));
		assert(matcher.match("/test/abc/xyz"));
		assert(matcher.match("/abc/test/xyz"));
		assert(!matcher.match("/abc/xyz/test"));
		assert(matcher.match("/abc/xyz/test/"));

		assert.strictEqual(matcher.toString(),"\"*/test/*\"");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"/test");
		assert.equal(matcher.subtract("/test/"),"");
		assert.equal(matcher.subtract("/test/abc/xyz"),"abc/xyz");
		assert.equal(matcher.subtract("/abc/test/xyz"),"/abcxyz");
		assert.equal(matcher.subtract("/abc/xyz/test"),"/abc/xyz/test");
		assert.equal(matcher.subtract("/abc/xyz/test/"),"/abc/xyz");
	});

	it("StringOrMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher("/test|/abc/*");

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof StringOrMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(matcher.match("/test"));
		assert(!matcher.match("/test/"));
		assert(!matcher.match("/test/abc/xyz"));
		assert(matcher.match("/abc/test/xyz"));
		assert(matcher.match("/abc/xyz/test"));
		assert(matcher.match("/abc/xyz/test/"));

		assert.strictEqual(matcher.toString(),"\"/test|/abc/*\"");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"");
		assert.equal(matcher.subtract("/test/"),"/test/");
		assert.equal(matcher.subtract("/test/abc/xyz"),"/test/abc/xyz");
		assert.equal(matcher.subtract("/abc/test/xyz"),"test/xyz");
		assert.equal(matcher.subtract("/abc/xyz/test"),"xyz/test");
		assert.equal(matcher.subtract("/abc/xyz/test/"),"xyz/test/");
	});

	it("RegExpMatcher",function(){
		let matcher = AbstractPathMatcher.getMatcher(/^\/test\/$/);

		assert(matcher);
		assert(matcher instanceof AbstractPathMatcher);
		assert(matcher instanceof RegExpMatcher);

		assert(!matcher.match(""));
		assert(!matcher.match("/"));
		assert(!matcher.match("/test"));
		assert(matcher.match("/test/"));
		assert(!matcher.match("/test/abc/xyz"));
		assert(!matcher.match("/abc/test/xyz"));
		assert(!matcher.match("/abc/xyz/test"));
		assert(!matcher.match("/abc/xyz/test/"));

		assert.strictEqual(matcher.toString(),"/^\\/test\\/$/");

		assert.equal(matcher.subtract(""),"");
		assert.equal(matcher.subtract("/"),"/");
		assert.equal(matcher.subtract("/test"),"/test");
		assert.equal(matcher.subtract("/test/"),"");
		assert.equal(matcher.subtract("/test/abc/xyz"),"/test/abc/xyz");
		assert.equal(matcher.subtract("/abc/test/xyz"),"/abc/test/xyz");
		assert.equal(matcher.subtract("/abc/xyz/test"),"/abc/xyz/test");
		assert.equal(matcher.subtract("/abc/xyz/test/"),"/abc/xyz/test/");
	});


});

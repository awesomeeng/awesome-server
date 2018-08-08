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

const CustomMatcher = (class CustomMatcher extends AbstractPathMatcher {});

describe("PathMatcher",function(){
	it("getMatcher",function(){
		assert(AbstractPathMatcher.getMatcher(/asdf/) instanceof RegExpMatcher);
		assert(AbstractPathMatcher.getMatcher("/abc|/xyz") instanceof StringOrMatcher);
		assert(AbstractPathMatcher.getMatcher("/asdf") instanceof StringExactMatcher);
		assert(AbstractPathMatcher.getMatcher("*/asdf") instanceof StringEndsWithMatcher);
		assert(AbstractPathMatcher.getMatcher("/asdf/*") instanceof StringStartsWithMatcher);
		assert(AbstractPathMatcher.getMatcher("*/asdf/*") instanceof StringContainsMatcher);
		assert(AbstractPathMatcher.getMatcher(new CustomMatcher()) instanceof CustomMatcher);
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

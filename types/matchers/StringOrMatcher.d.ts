export = StringOrMatcher;
/**
 * Matches the given path against at least 1 string PathMatcher expression.
 *
 * @extends AbstractPathMatcher
 */
declare class StringOrMatcher extends AbstractPathMatcher {
    constructor(path: any);
    get matchers(): any;
    match(path: any): any;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

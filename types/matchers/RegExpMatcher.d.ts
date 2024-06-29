export = RegExpMatcher;
/**
 * Matches a Regular Expression against a given path.
 *
 * @extends AbstractPathMatcher
 */
declare class RegExpMatcher extends AbstractPathMatcher {
    constructor(path: any);
    get path(): any;
    match(path: any): any;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

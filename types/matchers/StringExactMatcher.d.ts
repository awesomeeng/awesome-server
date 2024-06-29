export = StringExactMatcher;
/**
 * Matches the entire string against a given path.
 *
 * @extends AbstractPathMatcher
 */
declare class StringExactMatcher extends AbstractPathMatcher {
    constructor(path: any);
    get path(): any;
    match(path: any): boolean;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

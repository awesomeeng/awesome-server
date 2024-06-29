export = StringEndsWithMatcher;
/**
 * Matches the beginning portion of a string against a given path.
 *
 * @extends AbstractPathMatcher
 */
declare class StringEndsWithMatcher extends AbstractPathMatcher {
    constructor(path: any);
    get path(): any;
    match(path: any): any;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

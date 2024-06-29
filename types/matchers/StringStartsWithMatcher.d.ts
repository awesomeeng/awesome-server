export = StringStartsWithMatcher;
/**
 * Matches the beginning of a string against a given path.
 *
 * @extends AbstractPathMatcher
 */
declare class StringStartsWithMatcher extends AbstractPathMatcher {
    constructor(path: any);
    get path(): any;
    match(path: any): any;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

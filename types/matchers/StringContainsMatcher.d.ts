export = StringContainsMatcher;
/**
 * Matches any portion of a string against a given path.
 *
 * @extends AbstractPathMatcher
 */
declare class StringContainsMatcher extends AbstractPathMatcher {
    constructor(path: any);
    get path(): any;
    match(path: any): boolean;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

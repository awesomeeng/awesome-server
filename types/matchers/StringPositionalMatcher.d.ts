export = StringPositionalMatcher;
/**
 * Matches the entire string against a given path.
 *
 * @extends AbstractPathMatcher
 */
declare class StringPositionalMatcher extends AbstractPathMatcher {
    constructor(pattern: any);
    get pattern(): any;
    match(path: any): any;
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

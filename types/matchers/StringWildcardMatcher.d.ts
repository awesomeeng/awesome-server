export = StringWildcardMatcher;
/**
 * Matches the any path.
 *
 * @extends AbstractPathMatcher
 */
declare class StringWildcardMatcher extends AbstractPathMatcher {
    subtract(path: any): any;
}
import AbstractPathMatcher = require("../AbstractPathMatcher");

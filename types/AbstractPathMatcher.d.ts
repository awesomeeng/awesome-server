export = AbstractPathMatcher;
/**
 * Describes the required shape of a PathMatcher used by AwesomeServer
 * for determining if an incoming request path matches a specific router.
 *
 * The following functions are required to be implemented by
 * extending classes:
 *
 * 		match()
 * 		subtract()
 * 		toString()
 */
declare class AbstractPathMatcher {
    /**
     * Used by AwesomeServer to return an instance of the correct PathMatcher based
     * on the path argument passed in. This is used extensively in routing.
     *
     * @param  {(string|RegExp|AbstractPathMatcher)}  path
     * @return {AbstractPathMatcher}
     */
    static getMatcher(path: (string | RegExp | AbstractPathMatcher)): AbstractPathMatcher;
    /**
     * Returns the string version of this PathMatcher; used during logging.
     *
     * @return {string}
     */
    toString(): string;
    /**
     * Returns true if the given path is a match to this specific PathMatcher.
     *
     * @return {boolean}
     */
    match(): boolean;
    /**
     * If a given path is a match to this specific PathMatcher, return the given
     * path minus the parts of the path that matched.  If the given path is not a
     * match, return the given path unchanged.
     *
     * @return {string}
     */
    subtract(): string;
}

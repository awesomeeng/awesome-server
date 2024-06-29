export = AbstractController;
/**
 * Defines an AbstractController. For more information on controllers, please
 * see our Controller documentation:
 */
declare class AbstractController {
    /**
     * Executed before each individual request is handled. This will execute ONLY IF the
     * request method is implemented in the controller.
     *
     * @return {Promise|void} May return a promise or nothing. If a promise is returned, the promise is awaited
     * before moving the the handler function.
     */
    before(): Promise<any> | void;
    /**
     * Executed after each individual request is handled. This will execute ONLY IF the
     * request method is implemented in the controller.
     *
     * @return {Promise|void} May return a promise or nothing. If a promise is returned, the promise is awaited
     * before the final resolve.
     */
    after(): Promise<any> | void;
    /**
     * Executed only if a request method is not implemented in the controller. Can be used
     * as a kind of catch-all for requests.
     *
     * @return {Promise|void} May return a promise or nothing. If a promise is returned, the promise is awaited
     * before the final resolve.
     */
    any(): Promise<any> | void;
    /**
     * The handler function which is executed for each request entering this controller.
     * The handler function takes care of caling before(), any matching request handler
     * for a given request method, and after(). If no matching request handler is
     * found, before(), any(), and after(), are called.
     *
     * For any given request that is handled by this controller, the handler function
     * will attempt to find an appropriate handle function for a given request method.
     * It does so by looking for an all lowercase version of the method, or an all
     * uppsercase version of the method, or a
     * "handle<UpperCaseFirstCharacter><LowerCaseRemaining>" method. So for a GET
     * method it would try, in the following order...
     *
     * 		get()
     * 		GET()
     * 		handleGet()
     *
     * The first matching function wins.
     *
     * The handling function will be called with the signature
     *
     * 		(path,request,response)
     *
     * For example,
     *
     * 		get(path,request,response)
     *
     * The handling function may return a promise. If it does so, this
     * handle function will await for the promise to resolve.
     *
     * Generally speaking, it is probably best not to overload this function but
     * to use before(), after(), any(), or the specific request method handler.
     *
     * @param  {string}           path     The remaining path string, after the matching route portion is removed.
     * @param  {AbstractRequest}  request  The request object.
     * @param  {AbstractResponse} response The response object.
     *
     * @return {Promise} Returns a Promise that resolves when the request has been handled.
     */
    handler(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
}

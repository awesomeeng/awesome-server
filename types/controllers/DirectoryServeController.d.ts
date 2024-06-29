export = DirectoryServeController;
/**
 * A specialized controller for serving a directory of content as incoming requests
 * come in. This controller is used from AwesomeServer.serve() when passed a directory.
 *
 * @extends AbstractController
 */
declare class DirectoryServeController extends AbstractController {
    /**
     * Instantiate the controller.
     *
     * @param {string} dir fully resolved directory.
     * @constructor
     */
    constructor(dir: string);
    /**
     * Returns the directory being served.
     *
     * @return {string}
     */
    get dir(): string;
    /**
     * get handler. Returns a Promise that resolves when the response
     * is completed.  If a request does not match a file in the
     * directory, a 404 error is returned.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise}
     */
    get(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
    /**
     * head handler. Returns a Promise that resolves when the response
     * is completed.  If a request does not match a file in the
     * directory, a 404 error is returned.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise}
     */
    head(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
}
import AbstractController = require("../AbstractController");

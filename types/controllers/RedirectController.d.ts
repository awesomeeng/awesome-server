export = FileServeController;
/**
 * A specialized controller for serving a redirects as incoming requests
 * come in. This controller is used from AwesomeServer.redirect() when passed a directory.
 *
 * @extends AbstractController
 */
declare class FileServeController extends AbstractController {
    /**
     * Instantiate the controller. As incoming requests come in and match this
     * controller, a 302 (for temporary) or a 301 (for permanent) redirect is
     * sent with the toPath as the Location value.
     *
     * @param {string}  toPath
     * @param {boolean} [temporary=false]
     */
    constructor(toPath: string, temporary?: boolean);
    /**
     * The toPath passed into the controller.
     *
     * @return {string}
     */
    get toPath(): string;
    /**
     * The temporary boolean passed into the controller.
     *
     * @return {boolean}
     */
    get temporary(): boolean;
    /**
     * any handler which will redirect any incoming request regardless of
     * method to our new location.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise}
     */
    any(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
}
import AbstractController = require("../AbstractController");

export = PushServeController;
/**
 * A specialized controller for doing HTTP/2 push responses. This
 * controller is used from AwesomeServer.push().
 *
 * @extends AbstractController
 */
declare class PushServeController extends AbstractController {
    /**
     * Instantiate the controller to push the given filename resource with the
     * given contentType and referencePath.
     *
     * THe filename should be fully resvoled and must exist.
     *
     * THe referencePath is the filename which the push request is labeled with
     * and used by the client side of HTTP/2 resolving.
     *
     * If contentType is null the controller will attempt to guess the contentType
     * from the filename. If it cannot do that it will fallback to
     * "application/octet-stream".
     *
     * @param {string} referencePath
     * @param {(string|null)} contentType
     * @param {string} filename
     */
    constructor(referencePath: string, contentType: (string | null), filename: string);
    /**
     * Returns the filename passed to the constructor.
     *
     * @return {string}
     */
    get filename(): string;
    /**
     * Returns the contentType. If the contentType passed to the constructor was
     * null, this will return the guessed contentType or "application/octet-stream".
     *
     * @return {string}
     */
    get contentType(): string;
    /**
     * Returns the referencePath passed into the constructor.
     *
     * @return {string}
     */
    get referencePath(): string;
    /**
     * get handler.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise}
     */
    get(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
}
import AbstractController = require("../AbstractController");

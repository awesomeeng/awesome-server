export = FileServeController;
/**
 * A specialized controller for serving a a specific file as incoming requests
 * come in. This controller is used from AwesomeServer.serve() when passed a file.
 *
 * @extends AbstractController
 */
declare class FileServeController extends AbstractController {
    /**
     * Instantiate the controller. Given some filename, handle incoming requests
     * by responding with the contentType and contents of the file.
     *
     * If contentType is not provided, the controller will attempt to guess
     * the contentType from the filename. It will return "application/octet-stream"
     * if no contentType can be guessed.
     *
     * The filename needs to have been fully resolved.
     *
     * @param {(string|null)} contentType
     * @param {string} filename
     */
    constructor(contentType: (string | null), filename: string);
    /**
     * Returns the filename passed into the constructor.
     *
     * @return {string}
     */
    get filename(): string;
    /**
     * Returns the contentType. If the contentType passed into the controller
     * was null, this will return the guessed contentType.
     *
     * @return {(string|null)}
     */
    get contentType(): string;
    /**
     * Get handler.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise}
     */
    get(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
    /**
     * Get handler.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise}
     */
    head(path: string, request: AbstractRequest, response: AbstractResponse): Promise<any>;
}
import AbstractController = require("../AbstractController");

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { AbstractController } from "../AbstractController";
import { AbstractRequest } from "../AbstractRequest";
import { AbstractResponse } from "../AbstractResponse";

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");

/**
 * A specialized controller for serving a a specific file as incoming requests
 * come in. This controller is used from AwesomeServer.serve() when passed a file.
 *
 * @extends AbstractController
 */
export class FileServeController extends AbstractController {
    private [$FILENAME]: string;
    private [$CONTENTTYPE]: string;

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
     * @param {string|null} contentType
     * @param {string} filename
     */
    constructor(contentType: string | null, filename: string) {
        if (!filename) throw new Error("Missing filename.");
        if (typeof filename !== "string") throw new Error("Invalid filename.");

        super();

        if (!contentType) {
            contentType = AwesomeUtils.MimeTypes.getTypeForExtension(filename, "application/octet-stream");
        }

        this[$FILENAME] = filename;
        this[$CONTENTTYPE] = contentType;
    }

    /**
     * Returns the filename passed into the constructor.
     *
     * @return {string}
     */
    get filename(): string {
        return this[$FILENAME];
    }

    /**
     * Returns the contentType. If the contentType passed into the controller
     * was null, this will return the guessed contentType.
     *
     * @return {string}
     */
    get contentType(): string {
        return this[$CONTENTTYPE];
    }

    /**
     * Get handler.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise<void>}
     */
    async get(path: string, request: AbstractRequest, response: AbstractResponse): Promise<void> {
        return response.serve(this.filename);
    }

    /**
     * Head handler.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise<void>}
     */
    async head(path: string, request: AbstractRequest, response: AbstractResponse): Promise<void> {
        try {
            // check if file exists.
            const exists = await AwesomeUtils.FS.exists(this.filename);
            response.writeHead(exists ? 200 : 404, {});
            response.end();
        }
        catch (ex) {
            throw ex;
        }
    }
}

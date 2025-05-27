// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { AbstractController } from "../AbstractController";
import { AbstractRequest } from "../AbstractRequest";
import { AbstractResponse } from "../AbstractResponse";

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");
const REFERENCEPATH = Symbol("referencePath");

/**
 * A specialized controller for doing HTTP/2 push responses. This
 * controller is used from AwesomeServer.push().
 *
 * @extends AbstractController
 */
export class PushServeController extends AbstractController {
    private [$FILENAME]: string;
    private [$CONTENTTYPE]: string;
    private [REFERENCEPATH]: string;

    /**
     * Instantiate the controller to push the given filename resource with the
     * given contentType and referencePath.
     *
     * The filename should be fully resolved and must exist.
     *
     * The referencePath is the filename which the push request is labeled with
     * and used by the client side of HTTP/2 resolving.
     *
     * If contentType is null the controller will attempt to guess the contentType
     * from the filename. If it cannot do that it will fallback to
     * "application/octet-stream".
     *
     * @param {string} referencePath
     * @param {string|null} contentType
     * @param {string} filename
     */
    constructor(referencePath: string, contentType: string | null, filename: string) {
        if (!filename) throw new Error("Missing filename.");
        if (typeof filename !== "string") throw new Error("Invalid filename.");

        super();

        if (!contentType) {
            contentType = AwesomeUtils.MimeTypes.getTypeForExtension(filename, "application/octet-stream");
        }

        this[$FILENAME] = filename;
        this[$CONTENTTYPE] = contentType;
        this[REFERENCEPATH] = referencePath;
    }

    /**
     * Returns the filename passed to the constructor.
     *
     * @return {string}
     */
    get filename(): string {
        return this[$FILENAME];
    }

    /**
     * Returns the contentType. If the contentType passed to the constructor was
     * null, this will return the guessed contentType or "application/octet-stream".
     *
     * @return {string}
     */
    get contentType(): string {
        return this[$CONTENTTYPE];
    }

    /**
     * Returns the referencePath passed into the constructor.
     *
     * @return {string}
     */
    get referencePath(): string {
        return this[REFERENCEPATH];
    }

    /**
     * get handler.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise<void>}
     */
    async get(path: string, request: AbstractRequest, response: AbstractResponse): Promise<void> {
        // we can push if its a get.
        try {
            if (response.pushSupported) {
                // Since pushServe doesn't exist in our current AbstractResponse,
                // we'll need to implement this differently or update AbstractResponse
                // to include this method
                await response.serve(this.filename, {
                    "Content-Type": this.contentType
                });
            }
        }
        catch (ex) {
            throw ex;
        }
    }
}

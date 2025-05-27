// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import * as Path from "path";
import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { Log } from "@awesomeeng/awesome-log";
import { AbstractController } from "../AbstractController";
import { AbstractRequest } from "../AbstractRequest";
import { AbstractResponse } from "../AbstractResponse";

const $DIR = Symbol("dir");

/**
 * A specialized controller for serving a directory of content as incoming requests
 * come in. This controller is used from AwesomeServer.serve() when passed a directory.
 *
 * @extends AbstractController
 */
export class DirectoryServeController extends AbstractController {
    private [$DIR]: string;

    /**
     * Instantiate the controller.
     *
     * @param {string} dir fully resolved directory.
     * @constructor
     */
    constructor(dir: string) {
        if (!dir) throw new Error("Missing dir.");
        if (typeof dir !== "string") throw new Error("Invalid dir.");

        super();

        this[$DIR] = dir;
    }

    /**
     * Returns the directory being served.
     *
     * @return {string}
     */
    get dir(): string {
        return this[$DIR];
    }

    /**
     * get handler. Returns a Promise that resolves when the response
     * is completed.  If a request does not match a file in the
     * directory, a 404 error is returned.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise<void>}
     */
    async get(path: string, request: AbstractRequest, response: AbstractResponse): Promise<void> {
        try {
            // if not a full path, index.html it.
            if (!path || path === "/") path = "index.html";

            // resolve the filename relative to the implementation
            let filename = Path.resolve(this.dir, path);

            // validate the file exists.
            const stat = await AwesomeUtils.FS.stat(filename);
            if (!stat) {
                Log.warn("File not found: " + path);
                response.writeJSON(404, {
                    error: "File not found: " + path
                });
                return;
            }

            // if it is a directory, we need to serve things from inside it.
            if (stat && stat.isDirectory()) {
                filename = Path.resolve(path, "./index.html");
                const dirstat = await AwesomeUtils.FS.stat(filename);
                if (!dirstat) {
                    Log.warn("File not found: " + path);
                    response.writeJSON(404, {
                        error: "File not found: " + path
                    });
                    return;
                }
            }

            // guess the content type from the extension
            const contentType = AwesomeUtils.MimeTypes.getTypeForExtension(filename, "application/octet-stream");

            // serve the file
            await response.serve(filename, {
                "Content-Type": contentType
            });
        }
        catch (ex) {
            throw ex;
        }
    }

    /**
     * head handler. Returns a Promise that resolves when the response
     * is completed.  If a request does not match a file in the
     * directory, a 404 error is returned.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise<void>}
     */
    async head(path: string, request: AbstractRequest, response: AbstractResponse): Promise<void> {
        try {
            // if not a full path, index.html it.
            if (!path || path === "/") path = "index.html";

            // resolve the filename relative to the implementation
            const filename = Path.resolve(this.dir, path);

            // validate the file exists.
            const stat = await AwesomeUtils.FS.stat(filename);
            if (!stat) {
                response.writeHead(404, {});
                response.end();
                return;
            }

            response.writeHead(200, {});
            response.end();
        }
        catch (ex) {
            throw ex;
        }
    }
}

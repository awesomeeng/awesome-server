// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import { Log } from "@awesomeeng/awesome-log";
import { AbstractController } from "../AbstractController";
import { AbstractRequest } from "../AbstractRequest";
import { AbstractResponse } from "../AbstractResponse";

const TOPATH = Symbol("toPath");
const $TEMPORARY = Symbol("temporary");

/**
 * A specialized controller for serving a redirects as incoming requests
 * come in. This controller is used from AwesomeServer.redirect() when passed a directory.
 *
 * @extends AbstractController
 */
export class RedirectController extends AbstractController {
    private [TOPATH]: string;
    private [$TEMPORARY]: boolean;

    /**
     * Instantiate the controller. As incoming requests come in and match this
     * controller, a 302 (for temporary) or a 301 (for permanent) redirect is
     * sent with the toPath as the Location value.
     *
     * @param {string}  toPath
     * @param {boolean} [temporary=false]
     */
    constructor(toPath: string, temporary: boolean = false) {
        if (!toPath) throw new Error("Missing toPath.");
        if (typeof toPath !== "string") throw new Error("Invalid toPath.");

        super();

        this[TOPATH] = toPath;
        this[$TEMPORARY] = temporary;
    }

    /**
     * The toPath passed into the controller.
     *
     * @return {string}
     */
    get toPath(): string {
        return this[TOPATH];
    }

    /**
     * The temporary boolean passed into the controller.
     *
     * @return {boolean}
     */
    get temporary(): boolean {
        return this[$TEMPORARY];
    }

    /**
     * any handler which will redirect any incoming request regardless of
     * method to our new location.
     *
     * @param  {string}             path
     * @param  {AbstractRequest}    request
     * @param  {AbstractResponse}   response
     * @return {Promise<void>}
     */
    async any(path: string, request: AbstractRequest, response: AbstractResponse): Promise<void> {
        // log the redirect
        Log.info("Redirecting " + (this.temporary ? "temporarilly" : "permanently") + " to " + this.toPath);

        // send it
        response.writeHead(this.temporary ? 302 : 301, {
            Location: this.toPath
        });

        // and end it.
        response.end();
    }
}

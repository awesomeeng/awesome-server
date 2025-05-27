// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import * as Path from "path";
import * as FS from "fs";

// External Dependencies
import { Log } from "@awesomeeng/awesome-log";
import { AwesomeUtils } from "@awesomeeng/awesome-utils";

// Internal Dependencies
import { AbstractServer } from "./AbstractServer";
import { AbstractRequest } from "./AbstractRequest";
import { AbstractResponse } from "./AbstractResponse";
import { AbstractController } from "./AbstractController";
import { AbstractPathMatcher } from "./AbstractPathMatcher";
import { FileServeController } from "./controllers/FileServeController";
import { DirectoryServeController } from "./controllers/DirectoryServeController";
import { PushServeController } from "./controllers/PushServeController";
import { RedirectController } from "./controllers/RedirectController";

// Define our symbols which is how we do private methods and members
const $CONFIG = Symbol("config");
const $SERVERS = Symbol("servers");
const $ROUTES = Symbol("routes");
const $RUNNING = Symbol("running");

interface AwesomeServerConfig {
    informative: boolean;
    [key: string]: unknown;
}

interface Route {
    path: string | RegExp | AbstractPathMatcher;
    controller: AbstractController;
}

/**
 * AwesomeServer is a customizable API Server framework for enterprise nodejs
 * applications. It is an easy to setup HTTP or HTTPS or HTTP/2 server allowing you to
 * provide flexible routing and controllers for responding to incoming requests in a
 * consistent, repeatable fashion.
 *
 * Please see the documentation at @link https://github.com/awesomeeng/AwesomeServer.
 */
class AwesomeServer {
    private [$CONFIG]: AwesomeServerConfig;
    private [$RUNNING]: boolean;
    private [$SERVERS]: Set<AbstractServer>;
    private [$ROUTES]: Route[];

    /**
     * Creates a new AwesomeServer instance.
     *
     * You may create multiple AwesomeServer instances and do different things with them.
     *
     * Takes an optional config object for passing in configuration about the overall
     * AwesomeServer instance.  This is not the same as the config provided to each
     * server when it is constructed/added via addHTTPServer(config) and the like.
     * Those configs are separate.
     *
     * The default configuration looks like this:
     *
     *   config = {
     *       informative: true
     *   }
     *
     *   config.informative - If true, log statements are provided for how AwesomeServer
     *   is executing. If false, no log statements are output. Error and warning
     *   log message are always output.
     *
     * @constructor
     */
    constructor(config: Partial<AwesomeServerConfig> = {}) {
        const fullConfig = AwesomeUtils.Object.extend({
            informative: true
        }, config);
        
        this[$CONFIG] = fullConfig;
        this[$RUNNING] = false;
        this[$SERVERS] = new Set();
        this[$ROUTES] = [];
    }

    /**
     * Returns a reference to the AbstractServer class for custom extensions.
     *
     * @return Class
     */
    static get AbstractServer(): typeof AbstractServer {
        return AbstractServer;
    }

    /**
     * Returns a reference to the AbstractRequest class for custom extensions.
     *
     * @return Class
     */
    static get AbstractRequest(): typeof AbstractRequest {
        return AbstractRequest;
    }

    /**
     * Returns a reference to the AbstractResponse class for custom extensions.
     *
     * @return Class
     */
    static get AbstractResponse(): typeof AbstractResponse {
        return AbstractResponse;
    }

    /**
     * Returns a reference to the AbstractController class for custom extensions.
     *
     * @return Class
     */
    static get AbstractController(): typeof AbstractController {
        return AbstractController;
    }

    /**
     * Returns a reference to the AbstractPathMatcher class for custom extensions.
     *
     * @return Class
     */
    static get AbstractPathMatcher(): typeof AbstractPathMatcher {
        return AbstractPathMatcher;
    }

    /**
     * Returns a reference to the FileServeController class for custom extensions.
     *
     * @return Class
     */
    static get FileServeController(): typeof FileServeController {
        return FileServeController;
    }

    /**
     * Returns a reference to the DirectoryServeController class for custom extensions.
     *
     * @return Class
     */
    static get DirectoryServeController(): typeof DirectoryServeController {
        return DirectoryServeController;
    }

    /**
     * Returns a reference to the PushServeController class for custom extensions.
     *
     * @return Class
     */
    static get PushServeController(): typeof PushServeController {
        return PushServeController;
    }

    /**
     * Returns a reference to the RedirectController class for custom extensions.
     *
     * @return Class
     */
    static get RedirectController(): typeof RedirectController {
        return RedirectController;
    }

    /**
     * Returns true if this server is running.
     *
     * @return {boolean}
     */
    get running(): boolean {
        return this[$RUNNING];
    }

    /**
     * Returns the array of routes currently defined.
     *
     * @return {Route[]}
     */
    get routes(): Route[] {
        return Array.from(this[$ROUTES]);
    }

    /**
     * Returns the array of servers currently added.
     *
     * @return {AbstractServer[]}
     */
    get servers(): AbstractServer[] {
        return Array.from(this[$SERVERS]);
    }

    /**
     * Return the config object used to create this instance.
     *
     * @return {AwesomeServerConfig}
     */
    get config(): AwesomeServerConfig {
        return this[$CONFIG];
    }

    // Additional methods would go here...
}

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import * as HTTPS from "https";
import * as FS from "fs";
import * as Path from "path";

import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { Log } from "@awesomeeng/awesome-log";

import { HTTPServer } from "../http/HTTPServer";
import { HTTPSRequest } from "./HTTPSRequest";
import { HTTPSResponse } from "./HTTPSResponse";

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

interface HTTPSServerConfig {
    hostname?: string;
    host?: string;
    port: number;
    key: string | Buffer | null;
    cert: string | Buffer | null;
    pfx: string | Buffer | null;
    informative: boolean;
    [key: string]: unknown;
}

/**
 * HTTPS implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTPSServer() is used. This is basically a
 * wrapper around nodejs' https module.
 *
 * @extends HTTPServer
 */
class HTTPSServer extends HTTPServer {
    private [$SERVER]: HTTPS.Server | null;
    private [$RUNNING]: boolean;

    /**
     * Adds a new HTTPS Server to the AwesomeServer instance. The HTTPS Server is
     * a wrapped version of nodejs's *https* module and thus behaves as that
     * module behaves, with some slight differences.  Each request that comes
     * through will have its request and response objects wrapped in AwesomeServer's
     * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
     * cleaner access layer to the underlying request or response. See AbstractRequest
     * and AbstractResponse for more details.
     *
     * Takes a *config* object as an argument that is passed to the underlying HTTPS
     * module.  The basic structure of this config is below with the default values shown:
     *
     * ```
     * const config = {
     *   hostname: "localhost"
     *   port: 0,
     *   key: null,
     *   cert: null,
     *   pfx: null,
     *   informative: true
     * };
     * ```
     *
     * *key*, *cert*, and *pfx* are handled specially in AwesomeServer. You may supply
     * a string representing the certificate or a string representing a valid path
     * to a file containing the certificate. AwesomeServer will attempt to load
     * the file and if successful use that as the value.
     *
     * For more details about config values, please see [nodejs' *https* module]()
     *
     * **An important note about config**: The default *hostname* setting for AwesomeServer
     * is `localhost`. This is different than the default for the underlying
     * nodejs *https* module of `0.0.0.0`.
     *
     * @param {HTTPSServerConfig} config Configuration options for the HTTPS server
     */
    constructor(config: Partial<HTTPSServerConfig>) {
        super(AwesomeUtils.Object.extend({
            hostname: "localhost",
            port: 0,
            informative: true
        }, config));

        this[$SERVER] = null;
        this[$RUNNING] = false;
    }

    /**
     * Returns true if this server is started.
     *
     * @return {boolean}
     */
    get running(): boolean {
        return !!this[$SERVER] && this[$RUNNING];
    }

    /**
    * Returns the underlying, wrapped, nodejs https server.
    *
    * @return {HTTPS.Server|null}
    */
    get original(): HTTPS.Server | null {
        return this[$SERVER];
    }

    /**
     * Returns the bound hostname for this server.
     *
     * @return {string}
     */
    get hostname(): string {
        return (this.original && this.original.address() && typeof this.original.address() === 'object' && this.original.address()!.address) || 
               this.config.hostname || 
               this.config.host || 
               "localhost";
    }

    /**
     * Returns the bound port for this server.
     *
     * @return {number}
     */
    get port(): number {
        return (this.original && this.original.address() && typeof this.original.address() === 'object' && this.original.address()!.port) || 
               this.config.port || 
               0;
    }

    /**
     * Start this server running.
     *
     * @param {Function} handler
     * @return {Promise<void>}
     */
    async start(handler: (request: HTTPSRequest, response: HTTPSResponse) => void): Promise<void> {
        if (this.running) return;

        return new Promise((resolve,reject) => {
            try {
                this[$SERVER] = HTTPS.createServer(this.config,(request,response) => {
                    handler(new HTTPSRequest(request),new HTTPSResponse(response));
                });

                this[$SERVER].on("error",(err) => {
                    Log.error("HTTPS Server Error: ",err);
                });

                this[$SERVER].listen(this.config.port,this.config.hostname || this.config.host,() => {
                    this[$RUNNING] = true;
                    resolve();
                });
            }
            catch (ex) {
                return reject(ex);
            }
        });
    }

    /**
     * Stop this server.
     *
     * @return {Promise<void>}
     */
    async stop(): Promise<void> {
        if (!this.running) return;

        return new Promise((resolve,reject) => {
            try {
                this[$SERVER]!.close(() => {
                    this[$RUNNING] = false;
                    this[$SERVER] = null;
                    resolve();
                });
            }
            catch (ex) {
                return reject(ex);
            }
        });
    }
}

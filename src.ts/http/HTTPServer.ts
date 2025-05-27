// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import * as HTTP from "http";
import { AwesomeUtils } from "@awesomeeng/awesome-utils";
import { Log } from "@awesomeeng/awesome-log";

import { AbstractServer } from "../AbstractServer";
import { HTTPRequest } from "./HTTPRequest";
import { HTTPResponse } from "./HTTPResponse";

const $SERVER = Symbol("server");
const $RUNNING = Symbol("running");

interface HTTPServerConfig {
    hostname?: string;
    host?: string;
    port: number;
    informative: boolean;
    [key: string]: unknown;
}

/**
 * HTTP implementation of AbstractServer, which is used by AwesomeServer
 * when AwesomeServer.addHTTPServer() is used. This is basically a
 * wrapper around nodejs' http module.
 *
 * @extends AbstractServer
 */
export class HTTPServer extends AbstractServer {
    private [$SERVER]: HTTP.Server | null;
    private [$RUNNING]: boolean;

    /**
    * Creates a new HTTP Server to the AwesomeServer instance. The HTTP Server is
    * a wrapped version of nodejs's *http* module and thus behaves as that
    * module behaves, with some slight differences.  Each request that comes
    * through will have its request and response objects wrapped in AwesomeServer's
    * custom HTTPRequest and HTTPResponse objects. The provide a simplified but
    * cleaner access layer to the underlying request or response. See AbstractRequest
    * and AbstractResponse for more details.
    *
    * Takes a *config* object as an argument that is passed to the underlying HTTP
    * module.  The basic structure of this config is below with the default values shown:
    *
    * ```
    * const config = {
    *   hostname: "localhost"
    *   port: 0,
    *   informative: true
    * };
    * ```
    * For more details about config values, please see [nodejs' http module]()
    *
    * **An important note about config**: The default *hostname* setting for AwesomeServer
    * is `localhost`. This is different than the default for the underlying
    * nodejs http module of `0.0.0.0`.
    *
    * @param {HTTPServerConfig} config Configuration options for the HTTP server
    */
    constructor(config: Partial<HTTPServerConfig>) {
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
     * Returns the underlying, wrapped, nodejs http server.
     *
     * @return {HTTP.Server|null}
     */
    get original(): HTTP.Server | null {
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
    async start(handler: (request: HTTPRequest, response: HTTPResponse) => void): Promise<void> {
        if (this.running) return;

        return new Promise((resolve,reject) => {
            try {
                this[$SERVER] = HTTP.createServer((request,response) => {
                    handler(new HTTPRequest(request),new HTTPResponse(response));
                });

                this[$SERVER].on("error",(err) => {
                    Log.error("HTTP Server Error: ",err);
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

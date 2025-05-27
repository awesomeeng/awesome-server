// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

import * as FS from "fs";
import { AwesomeUtils } from "@awesomeeng/awesome-utils";

// Define our symbols for privacy.
const $ORIGINAL = Symbol("original");

/**
 * Describes the required shape of all response objects passed to AwesomeServer
 * by an AbstractServer.
 *
 * The following functions are required to be implemented by
 * extending classes:
 *
 * 		get original()
 * 		get finished()
 * 		get statusCode()
 * 		get contentType()
 * 		get contentEncoding()
 * 		get pushSupported()
 * 		writeHead()
 * 		write()
 * 		end()
 * 		pipeFrom()
 *
 * Provides the convenience methods:
 *
 * 		writeText()
 * 		writeHTML()
 * 		writeCSS()
 * 		writeJSON()
 * 		writeError()
 * 		serve()
 */
export abstract class AbstractResponse {
	private [$ORIGINAL]: unknown;

	/**
	 * Creates an AbstractResponse which wraps an originalResponse object.
	 *
	 * @param {unknown} originalResponse
	 */
	constructor(originalResponse: unknown) {
		this[$ORIGINAL] = originalResponse;
	}

	/**
	 * Returns the original, underlying response object, whatever that might be.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {unknown}
	 */
	get original(): unknown {
		return this[$ORIGINAL];
	}

	/**
	 * Returns true if the end() method has been called and this request is
	 * closed to further writes.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {boolean}
	 */
	abstract get finished(): boolean;

	/**
	 * Returns the response status code, if one has been set, for this
	 * response.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {number}
	 */
	abstract get statusCode(): number;

	/**
	 * Returns the response mime-type portion of the content-type
	 * header, if one has been set.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {string}
	 */
	abstract get contentType(): string;

	/**
	 * Returns the response charset (encoding) portion of the content-type
	 * header, if one has been set.
	 *
	 * It is up to the implementor on how this is obtained.
	 *
	 * @return {string}
	 */
	abstract get contentEncoding(): string;

	/**
	 * Returns true if HTTP/2 server push is supported by this response.
	 *
	 * @return {boolean}
	 */
	abstract get pushSupported(): boolean;

	/**
	 * Write the response headers.
	 *
	 * @param {number} statusCode
	 * @param {Record<string,string>} headers
	 *
	 * @return {void}
	 */
	abstract writeHead(statusCode: number, headers: Record<string, string>): void;

	/**
	 * Write content to the response. Content can be a string or a Buffer.
	 *
	 * @param {string|Buffer} content
	 * @return {void}
	 */
	abstract write(content: string | Buffer): void;

	/**
	 * Close the response to any more writes.
	 *
	 * @return {void}
	 */
	abstract end(): void;

	/**
	 * Pipe the content of a readable stream to this response.
	 *
	 * @param {NodeJS.ReadableStream} readable
	 * @return {Promise<void>}
	 */
	abstract pipeFrom(readable: NodeJS.ReadableStream): Promise<void>;

	/**
	 * Write text content as the response with a given statusCode.
	 *
	 * @param {number} statusCode
	 * @param {string} text
	 * @return {void}
	 */
	writeText(statusCode: number, text: string): void {
		this.writeHead(statusCode,{
			"Content-Type": "text/plain",
			"Content-Length": text.length+""
		});
		this.write(text);
		this.end();
	}

	/**
	 * Write HTML content as the response with a given statusCode.
	 *
	 * @param {number} statusCode
	 * @param {string} html
	 * @return {void}
	 */
	writeHTML(statusCode: number, html: string): void {
		this.writeHead(statusCode,{
			"Content-Type": "text/html",
			"Content-Length": html.length+""
		});
		this.write(html);
		this.end();
	}

	/**
	 * Write CSS content as the response with a given statusCode.
	 *
	 * @param {number} statusCode
	 * @param {string} css
	 * @return {void}
	 */
	writeCSS(statusCode: number, css: string): void {
		this.writeHead(statusCode,{
			"Content-Type": "text/css",
			"Content-Length": css.length+""
		});
		this.write(css);
		this.end();
	}

	/**
	 * Write JSON content as the response with a given statusCode.
	 *
	 * @param {number} statusCode
	 * @param {unknown} obj
	 * @return {void}
	 */
	writeJSON(statusCode: number, obj: unknown): void {
		const text = JSON.stringify(obj);
		this.writeHead(statusCode,{
			"Content-Type": "application/json",
			"Content-Length": text.length+""
		});
		this.write(text);
		this.end();
	}

	/**
	 * Write an error response.
	 *
	 * @param {Error} error
	 * @return {void}
	 */
	writeError(error: Error): void {
		this.writeJSON(500,{
			error: error.message || "Unknown Error.",
			stack: error.stack && error.stack.split("\n") || []
		});
	}

	/**
	 * Serve the content of a file to this response.
	 *
	 * @param {string} filename
	 * @param {Record<string,string>} [headers]
	 * @return {Promise<void>}
	 */
	async serve(filename: string, headers: Record<string, string> = {}): Promise<void> {
		if (!FS.existsSync(filename)) throw new Error("File not found.");
		if (!FS.statSync(filename).isFile()) throw new Error("File not found.");

		const mime = AwesomeUtils.MimeTypes.getTypeForExtension(AwesomeUtils.FileSystems.extension(filename));
		const contentLength = FS.statSync(filename).size;

		this.writeHead(200,Object.assign({},headers,{
			"Content-Type": mime || "application/octet-stream",
			"Content-Length": contentLength+""
		}));

		await this.pipeFrom(FS.createReadStream(filename));
		this.end();
	}
}

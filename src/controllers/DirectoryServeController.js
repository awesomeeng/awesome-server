// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("@awesomeeng/awesome-log");

const AbstractController = require("../AbstractController");

const $DIR = Symbol("dir");

/**
 * A specialized controller for serving a directory of content as incoming requests
 * come in. This controller is used from AwesomeServer.serve() when passed a directory.
 *
 * @extends AbstractController
 */
class DirectoryServeController extends AbstractController {
	/**
	 * Instantiate the controller.
	 *
	 * @param {string} dir fully resolved directory.
	 * @constructor
	 */
	constructor(dir) {
		if (!dir) throw new Error("Missing dir.");
		if (typeof dir!=="string") throw new Error("Invalid dir.");

		super();

		this[$DIR] = dir;
	}

	/**
	 * Returns the directory being served.
	 *
	 * @return {string}
	 */
	get dir() {
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
	 * @return {Promise}
	 */
	get(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				// if not a full path, index.html it.
				if (!path || path==="/") path = "index.html";

				// resolve the filename relative to the implementation
				let filename = Path.resolve(this.dir,path);

				// validate the file exists.
				let stat = await AwesomeUtils.FS.stat(filename);
				if (!stat) {
					Log.warn("File not found: "+path);
					response.writeError(404,"File not found: "+path);
					return resolve();
				}
				// if it is a directory, we need to serve things from inside it.
				if (stat && stat.isDirectory()) {
					filename = Path.resolve(path,"./index.html");
					let dirstat = await AwesomeUtils.FS.stat(filename);
					if (!dirstat) {
						Log.warn("File not found: "+path);
						response.writeError(404,"File not found: "+path);
						return resolve();
					}
				}

				// guess the content type from the extension
				let contentType = AwesomeUtils.MimeTypes.getTypeForExtension(filename,"application/octet-stream");

				// serve the file
				await response.serve(200,contentType,filename);

				// and resolve our promise.
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	/**
	 * head handler. Returns a Promise that resolves when the response
	 * is completed.  If a request does not match a file in the
	 * directory, a 404 error is returned.
	 *
	 * @param  {string}             path
	 * @param  {AbstractRequest}    request
	 * @param  {AbstractResponse}   response
	 * @return {Promise}
	 */
	head(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				// if not a full path, index.html it.
				if (!path || path==="/") path = "index.html";

				// resolve the file relative to the implementation.
				let filename = Path.resolve(this.dir,path);

				// validate the file exist.
				let stat = await AwesomeUtils.FS.stat(filename);
				if (!stat) {
					Log.warn("File not found: "+path);

					response.writeHead(404);
					await response.end();

					return resolve();
				}
				// if it is a directory, we need to serve what is inside it.
				if (stat && stat.isDirectory()) {
					filename = Path.resolve(path,"./index.html");
					let dirstat = await AwesomeUtils.FS.stat(filename);
					if (!dirstat) {
						Log.warn("File not found: "+path);

						response.writeHead(404);
						await response.end();

						return resolve();
					}
				}

				// this is just a HEAD call so we only need a status code.
				response.writeHead(200);

				// and end.
				await response.end();

				// resolve the promise.
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = DirectoryServeController;

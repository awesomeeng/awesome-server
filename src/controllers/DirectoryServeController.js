// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");

const MimeTypes = require("../MimeTypes");

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
				if (!path || path==="/") path = "index.html";
				let filename = Path.resolve(this.dir,path);

				let stat = await AwesomeUtils.FS.stat(filename);
				if (!stat) {
					Log.warn("File not found: "+path);
					response.writeError(404,"File not found: "+path);
					return resolve();
				}
				if (stat && stat.isDirectory()) {
					filename = Path.resolve(path,"./index.html");
					let dirstat = await AwesomeUtils.FS.stat(filename);
					if (!dirstat) {
						Log.warn("File not found: "+path);
						response.writeError(404,"File not found: "+path);
						return resolve();
					}
				}

				let contentType = MimeTypes.getTypeForExtension(filename,"application/octet-stream");

				await response.serve(200,contentType,filename);
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
				if (!path || path==="/") path = "index.html";
				let filename = Path.resolve(this.dir,path);

				let exists = await AwesomeUtils.FS.exists(filename);
				if (!exists) Log.warn("File not found: "+path);

				response.writeHead(exists?200:404);
				await response.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = DirectoryServeController;

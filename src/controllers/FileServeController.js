// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractController = require("../AbstractController");

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");

/**
 * A specialized controller for serving a a specific file as incoming requests
 * come in. This controller is used from AwesomeServer.serve() when passed a file.
 *
 * @extends AbstractController
 */
class FileServeController extends AbstractController {
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
	 * @param {(string|null)} contentType
	 * @param {string} filename
	 */
	constructor(contentType,filename) {
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		super();

		if (!contentType) contentType = AwesomeUtils.MimeTypes.getTypeForExtension(filename,"application/octet-stream");

		this[$FILENAME] = filename;
		this[$CONTENTTYPE] = contentType;
	}

	/**
	 * Returns the filename passed into the constructor.
	 *
	 * @return {string}
	 */
	get filename() {
		return this[$FILENAME];
	}

	/**
	 * Returns the contentType. If the contentType passed into the controller
	 * was null, this will return the guessed contentType.
	 *
	 * @return {(string|null)}
	 */
	get contentType() {
		return this[$CONTENTTYPE];
	}

	/**
	 * Get handler.
	 *
	 * @param  {string}             path
	 * @param  {AbstractRequest}    request
	 * @param  {AbstractResponse}   response
	 * @return {Promise}
	 */
	get(path,request,response) {
		return response.serve(200,this.contentType,this.filename);
	}

	/**
	 * Get handler.
	 *
	 * @param  {string}             path
	 * @param  {AbstractRequest}    request
	 * @param  {AbstractResponse}   response
	 * @return {Promise}
	 */
	head(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				// check if file exists.
				let exists = await AwesomeUtils.FS.exists(this.filename);
				response.writeHead(exists?200:404);
				response.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = FileServeController;

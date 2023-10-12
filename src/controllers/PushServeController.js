// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractController = require("../AbstractController");

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");
const REFERENCEPATH = Symbol("referencePath");

/**
 * A specialized controller for doing HTTP/2 push responses. This
 * controller is used from AwesomeServer.push().
 *
 * @extends AbstractController
 */
class PushServeController extends AbstractController {
	/**
	 * Instantiate the controller to push the given filename resource with the
	 * given contentType and referencePath.
	 *
	 * THe filename should be fully resvoled and must exist.
	 *
	 * THe referencePath is the filename which the push request is labeled with
	 * and used by the client side of HTTP/2 resolving.
	 *
	 * If contentType is null the controller will attempt to guess the contentType
	 * from the filename. If it cannot do that it will fallback to
	 * "application/octet-stream".
	 *
	 * @param {string} referencePath
	 * @param {(string|null)} contentType
	 * @param {string} filename
	 */
	constructor(referencePath,contentType,filename) {
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		super();

		if (!contentType) contentType = AwesomeUtils.MimeTypes.getTypeForExtension(filename,"application/octet-stream");

		this[$FILENAME] = filename;
		this[$CONTENTTYPE] = contentType;
		this[REFERENCEPATH] = referencePath;
	}

	/**
	 * Returns the filename passed to the constructor.
	 *
	 * @return {string}
	 */
	get filename() {
		return this[$FILENAME];
	}

	/**
	 * Returns the contentType. If the contentType passed to the constructor was
	 * null, this will return the guessed contentType or "application/octet-stream".
	 *
	 * @return {string}
	 */
	get contentType() {
		return this[$CONTENTTYPE];
	}

	/**
	 * Returns the referencePath passed into the constructor.
	 *
	 * @return {string}
	 */
	get referencePath() {
		return this[REFERENCEPATH];
	}

	/**
	 * get handler.
	 *
	 * @param  {string}             path
	 * @param  {AbstractRequest}    request
	 * @param  {AbstractResponse}   response
	 * @return {Promise}
	 */
	get(path,request,response) {
		// we can push if its a get.
		return new Promise(async (resolve,reject)=>{
			try {
				if (response.pushSupported) {
					await response.pushServe(200,this.referencePath,this.contentType,this.filename);
				}
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = PushServeController;

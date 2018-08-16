// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");

const AbstractController = require("../AbstractController");

const TOPATH = Symbol("toPath");
const $TEMPORARY = Symbol("temporary");

/**
 * A specialized controller for serving a redirects as incoming requests
 * come in. This controller is used from AwesomeServer.redirect() when passed a directory.
 *
 * @extends AbstractController
 */
class FileServeController extends AbstractController {
	/**
	 * Instantiate the controller. As incoming requests come in and match this
	 * controller, a 302 (for temporary) or a 301 (for permanent) redirect is
	 * sent with the toPath as the Location value.
	 *
	 * @param {string}  toPath
	 * @param {boolean} [temporary=false]
	 */
	constructor(toPath,temporary=false) {
		if (!toPath) throw new Error("Missing toPath.");
		if (typeof toPath!=="string") throw new Error("Invalid toPath.");

		super();

		this[TOPATH] = toPath;
		this[$TEMPORARY] = temporary;
	}

	/**
	 * The toPath passed into the controller.
	 *
	 * @return {string}
	 */
	get toPath() {
		return this[TOPATH];
	}

	/**
	 * The temporary boolean passed into the controller.
	 *
	 * @return {boolean}
	 */
	get temporary() {
		return this[$TEMPORARY];
	}

	/**
	 * any handler which will redirect any incoming request regardless of
	 * method to our new location.
	 *
	 * @param  {string}             path
	 * @param  {AbstractRequest}    request
	 * @param  {AbstractResponse}   response
	 * @return {Promise}
	 */
	async any(path,request,response) {
		Log.info && Log.info("RedirectController","Redirecting "+(this.temporary?"temporarilly":"permanently")+" to "+this.toPath);
		response.writeHead(this.temporary ? 302 : 301,{
			Location: this.toPath
		});
		await response.end();
	}
}

module.exports = FileServeController;

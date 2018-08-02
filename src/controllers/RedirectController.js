// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");

const AbstractController = require("../AbstractController");

const TOPATH = Symbol("toPath");
const $TEMPORARY = Symbol("temporary");

class FileServeController extends AbstractController {
	constructor(toPath,temporary=false) {
		if (!toPath) throw new Error("Missing toPath.");
		if (typeof toPath!=="string") throw new Error("Invalid toPath.");

		super();

		this[TOPATH] = toPath;
		this[$TEMPORARY] = temporary;
	}

	get toPath() {
		return this[TOPATH];
	}

	get temporary() {
		return this[$TEMPORARY];
	}

	async any(path,request,response) {
		Log.info("RedirectController","Redirecting "+(this.temporary?"temporarilly":"permanently")+" to "+this.toPath);
		response.writeHead(this.temporary ? 302 : 301,{
			Location: this.toPath
		});
		await response.end();
	}
}

module.exports = FileServeController;

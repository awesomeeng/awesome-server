// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Mime = require("mime-types");

const AbstractController = require("../AbstractController");

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");
const REFERENCEPATH = Symbol("referencePath");

class PushServeController extends AbstractController {
	constructor(referencePath,contentType,filename) {
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		super();

		if (!contentType) contentType = Mime.lookup(filename) || "application/octet-stream";

		this[$FILENAME] = filename;
		this[$CONTENTTYPE] = contentType;
		this[REFERENCEPATH] = referencePath;
	}

	get filename() {
		return this[$FILENAME];
	}

	get contentType() {
		return this[$CONTENTTYPE];
	}

	get referencePath() {
		return this[REFERENCEPATH];
	}

	get(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				if (response.pushSupported) await response.pushServe(200,this.referencePath,this.contentType,this.filename);
				await response.serve(200,this.contentType,this.filename);
				await response.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = PushServeController;

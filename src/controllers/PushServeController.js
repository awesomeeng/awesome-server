// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractController = require("../AbstractController");

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");
const $RESOURCEPATH = Symbol("resourcePath");

class PushServeController extends AbstractController {
	constructor(resourcePath,contentType,filename) {
		if (!contentType) throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		super();

		this[$FILENAME] = filename;
		this[$CONTENTTYPE] = contentType;
		this[$RESOURCEPATH] = resourcePath;
	}

	get filename() {
		return this[$FILENAME];
	}

	get contentType() {
		return this[$CONTENTTYPE];
	}

	get resourcePath() {
		return this[$RESOURCEPATH];
	}

	get(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				if (response.pushSupported) await response.pushServe(200,this.resourcePath,this.contentType,this.filename);
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

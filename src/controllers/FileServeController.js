// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractController = require("../AbstractController");

const $FILENAME = Symbol("filename");
const $CONTENTTYPE = Symbol("contentType");

class FileServeController extends AbstractController {
	constructor(contentType,filename) {
		if (!contentType) throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (!filename) throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		super();

		this[$FILENAME] = filename;
		this[$CONTENTTYPE] = contentType;
	}

	get filename() {
		return this[$FILENAME];
	}

	get contentType() {
		return this[$CONTENTTYPE];
	}

	get(path,request,response) {
		return response.serve(200,this.contentType,this.filename);
	}
}

module.exports = FileServeController;

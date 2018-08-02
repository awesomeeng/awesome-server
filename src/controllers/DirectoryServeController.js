// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Path = require("path");

const Mime = require("mime-types");

const AwesomeUtils = require("AwesomeUtils");
const Log = require("AwesomeLog");

const AbstractController = require("../AbstractController");

const $DIR = Symbol("dir");

class DirectoryServeController extends AbstractController {
	constructor(dir) {
		if (!dir) throw new Error("Missing dir.");
		if (typeof dir!=="string") throw new Error("Invalid dir.");

		super();

		this[$DIR] = dir;
	}

	get dir() {
		return this[$DIR];
	}

	get(path,request,response) {
		return new Promise(async (resolve,reject)=>{
			try {
				if (!path || path==="/") path = "index.html";
				let filename = Path.resolve(this.dir,path);


				let exists = await AwesomeUtils.FS.exists(filename);
				if (!exists) {
					Log.warn("DirectoryServeController","File not found: "+path);
					response.writeError(404,"File not found: "+path);
					resolve();
				}

				let contentType = Mime.lookup(filename) || "application/octet-stream";

				await response.serve(200,contentType,filename);
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = DirectoryServeController;

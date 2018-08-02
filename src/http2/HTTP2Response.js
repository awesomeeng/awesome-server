// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP2 = require("http2");
const URL = require("url");
const FS = require("fs");

const Log = require("AwesomeLog");
const AwesomeUtils = require("AwesomeUtils");

const HTTPSResponse = require("../https/HTTPSResponse");
const PushResponse = require("./PushResponse");

const $SERVER_ROOT = Symbol("serverRoot");

class HTTP2Response extends HTTPSResponse {
	constructor(request,response) {
		super(response);
		this[$SERVER_ROOT] = request.headers[HTTP2.constants.HTTP2_HEADER_PATH];
	}

	get stream() {
		return this.original.stream;
	}

	get serverRoot() {
		return this[$SERVER_ROOT];
	}

	resolve(path) {
		return URL.resolve(this.serverRoot,path);
	}

	/**
	* Returns true if this http2 response has not been downgraded to a http 1.1 response
	* and thus push() and push...() functions are supported.
	*
	* @return {[type]} [description]
	*/
	get pushSupported() {
		return this.original.createPushResponse;
	}

	push(statusCode,path,contentType,content,headers={}) {
		if (!this.pushSupported) return Promise.reject("Push not supported.");
		if (!this.original.stream) return Promise.reject("Not http2 request, probably downgraded to http1.");

		if (arguments.length===1 && typeof statusCode!=="number") [statusCode,path,contentType,content,headers] = [200,null,"application/json",statusCode,null];
		if (typeof statusCode!=="number") [statusCode,path,contentType,content,headers] = [200,...arguments];

		if (!statusCode) throw new Error("Missing status code number.");
		if (typeof statusCode!=="number") throw new Error("Invalid status code number.");
		if (!contentType) throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (content===undefined) throw new Error("Missing content.");

		return new Promise(async (resolve,reject)=>{
			try {
				Log.info("HTTP2Response","Pushed to client: "+path);

				headers = headers || {};
				headers[HTTP2.constants.HTTP2_HEADER_STATUS] = headers[HTTP2.constants.HTTP2_HEADER_STATUS] || 200;
				headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] = headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] || contentType;
				headers[HTTP2.constants.HTTP2_HEADER_PATH] = headers[HTTP2.constants.HTTP2_HEADER_PATH] || this.resolve(path);
				headers[HTTP2.constants.HTTP2_HEADER_METHOD] = headers[HTTP2.constants.HTTP2_HEADER_METHOD] || "GET";
				headers[HTTP2.constants.HTTP2_HEADER_SCHEME] = headers[HTTP2.constants.HTTP2_HEADER_SCHEME] || "https";

				let pusher = await PushResponse.create(this,headers);
				pusher.writeHead(statusCode);
				await pusher.write(content);
				await pusher.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	pushText(statusCode,path,content,headers) {
		return this.push(statusCode,path,"text/plain",content,headers);
	}

	pushHTML(statusCode,path,content,headers) {
		return this.push(statusCode,path,"text/html",content,headers);
	}

	pushJSON(statusCode,path,content,headers) {
		return this.push(statusCode,path,"application/json",content,headers);
	}

	pushServe(statusCode,path,contentType,filename,headers) {
		if (!this.pushSupported) return Promise.reject("Push not supported.");
		if (!this.original.stream) return Promise.reject("Not http2 request, probably downgraded to http1.");

		if (arguments.length===1 && typeof statusCode!=="number") [statusCode,path,contentType,filename,headers] = [200,null,null,statusCode,null];
		if (typeof statusCode!=="number") [statusCode,path,contentType,filename,headers] = [200,...arguments];

		if (!statusCode) throw new Error("Missing status code number.");
		if (typeof statusCode!=="number") throw new Error("Invalid status code number.");
		if (!contentType) throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (!filename) throw new Error("Missing filename.");

		return new Promise(async (resolve,reject)=>{
			try {
				if (!AwesomeUtils.FS.existsSync(filename)) throw new Error("File not found: "+filename);

				Log.info("HTTP2Response","Pushed to client "+path+" from "+filename);

				headers = headers || {};
				headers[HTTP2.constants.HTTP2_HEADER_STATUS] = headers[HTTP2.constants.HTTP2_HEADER_STATUS] || 200;
				headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] = headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] || contentType;
				headers[HTTP2.constants.HTTP2_HEADER_PATH] = headers[HTTP2.constants.HTTP2_HEADER_PATH] || this.resolve(path);
				headers[HTTP2.constants.HTTP2_HEADER_METHOD] = headers[HTTP2.constants.HTTP2_HEADER_METHOD] || "GET";
				headers[HTTP2.constants.HTTP2_HEADER_SCHEME] = headers[HTTP2.constants.HTTP2_HEADER_SCHEME] || "https";

				let stream = FS.createReadStream(filename);

				let pusher = await PushResponse.create(this,headers);
				pusher.writeHead(statusCode);
				await pusher.pipeFrom(stream);
				await pusher.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});

	}
}

module.exports = HTTP2Response;

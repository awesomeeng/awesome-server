// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const HTTP2 = require("http2");
const URL = require("url");

const Log = require("AwesomeLog");

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

	push(statusCode,path,contentType,content,headers={}) {
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
				headers[HTTP2.constants.HTTP2_HEADER_CONTENT_TYPE] = contentType;
				headers[HTTP2.constants.HTTP2_HEADER_PATH] = this.resolve(path);

				let pusher = await PushResponse.create(this,headers);
				// pusher.writeHead(statusCode);
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
}

module.exports = HTTP2Response;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const FS = require("fs");

const AwesomeUtils = require("AwesomeUtils");
const Log = require("AwesomeLog");

const $ORIGINAL = Symbol("original");

class AbstractResponse {
	constructor(originalResponse) {
		this[$ORIGINAL] = originalResponse;
	}

	get original() {
		return this[$ORIGINAL];
	}

	get finished() {
		throw new Error("To be implemented by subclass.");
	}

	get statusCode() {
		throw new Error("To be implemented by subclass.");
	}

	get contentEncoding() {
		throw new Error("To be implemented by subclass.");
	}

	get contentType() {
		throw new Error("To be implemented by subclass.");
	}

	/**
	 * True if push() and push...() functions are supported by this response
	 * object. This is generally only true when the request supports bi-directional
	 * flow, such as HTTP/2.
	 *
	 * @return {boolean} true if push() and push...() functions are supported.
	 */
	get pushSupported() {
		return false;
	}

	writeHead(/*statusCode,statusMessage,headers*/) {
		throw new Error("To be implemented by subclass.");
	}

	write(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
	}

	end(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
	}

	pipeFrom(/*readable*/) {
		throw new Error("To be implemented by subclass.");
	}

	writeJSON(statusCode,content,headers=null) {
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null || content==="") throw new Error("Missing content.");

		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "application/json";
		statusCode = statusCode || 200;

		return new Promise(async (resolve,reject)=>{
			try {
				if (typeof content!=="string") content = JSON.stringify(content);

				this.writeHead(statusCode,headers);
				await this.write(content);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeText(statusCode,content,headers=null) {
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null || content==="") throw new Error("Missing content.");

		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/plain; charset=utf-8";
		statusCode = statusCode || 200;

		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(statusCode,headers);
				await this.write(content);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeCSS(statusCode,content,headers=null) {
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null || content==="") throw new Error("Missing content.");

		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/css; charset=utf-8";
		statusCode = statusCode || 200;

		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(200,{
					"Content-Type":"text/css"
				});
				await this.write(content);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeHTML(statusCode,content,headers=null) {
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null || content==="") throw new Error("Missing content.");

		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/html; charset=utf-8";
		statusCode = statusCode || 200;

		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(statusCode,headers);
				await this.write(content);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeError(statusCode,content,headers=null) {
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,content,headers] = [200,...arguments];
		if (content===undefined || content===null || content==="") throw new Error("Missing content.");

		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || "text/plain; charset=utf-8";
		statusCode = statusCode || 200;

		if (content instanceof Error && content.stack) content = content.message+"\n\n"+content.stack;
		else if (content instanceof Error) content = content.message;

		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(statusCode,headers);
				await this.write(content);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	serve(statusCode,contentType,filename,headers=null) {
		if (arguments.length===0) throw new Error("Missing content.");
		if (arguments.length>0 && typeof statusCode!=="number") [statusCode,contentType,filename,headers] = [200,...arguments];
		if (contentType===undefined || contentType===null || contentType==="") throw new Error("Missing contentType.");
		if (typeof contentType!=="string") throw new Error("Invalid contentType.");
		if (filename===undefined || filename===null || filename==="") throw new Error("Missing filename.");
		if (typeof filename!=="string") throw new Error("Invalid filename.");

		headers = headers || {};
		headers["Content-Type"] = headers["Content-Type"] || contentType;
		statusCode = statusCode || 200;

		return new Promise(async (resolve,reject)=>{
			try {
				if (!AwesomeUtils.FS.existsSync(filename)) throw new Error("File not found: "+filename);

				Log.info("AbstractResponse","Serving "+filename);

				this.writeHead(statusCode,headers);
				let stream = FS.createReadStream(filename);
				await this.pipeFrom(stream);
				await this.end();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = AbstractResponse;

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const QS = require("querystring");
const Readable = require("stream").Readable;

const AbstractResponse = require("../AbstractResponse");

class HTTPResponse extends AbstractResponse {
	constructor(response) {
		super(response);
	}

	get finished() {
		return this.original.finished;
	}

	get statusCode() {
		return this.original.statusCode;
	}

	get headers() {
		return this.original.getHeaders();
	}

	get contentType() {
		return this.headers && this.headers["content-type"] && this.headers["content-type"].replace(/^((.*);.*$|^(.*)$)/,"$2") || "";
	}

	get contentEncoding() {
		let parameters = this.headers && this.headers["content-type"] && this.headers["content-type"].replace(/^(.*;(.*)$|^.*$)/,"$2").trim() || "";
		return parameters && QS.parse(parameters).charset || "utf-8";
	}

	writeHead(statusCode,statusMessage,headers) {
		if (statusMessage===undefined || statusMessage===null) return this.original.writeHead(statusCode,headers);
		else return this.original.writeHead(statusCode,statusMessage,headers);
	}

	write(data,encoding) {
		return new Promise((resolve,reject)=>{
			try {
				this.original.write(data,encoding,(err)=>{
					if (err) reject(err);
					else resolve();
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	end(data,encoding) {
		return new Promise((resolve,reject)=>{
			try {
				this.original.end(data,encoding,(err)=>{
					if (err) reject(err);
					else resolve();
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	pipeFrom(readable) {
		if (!readable) throw new Error("Missing readable.");
		if (!(readable instanceof Readable)) throw new Error("Invalid readable.");

		return new Promise((resolve,reject)=>{
			try {
				readable.on("end",async ()=>{
					await this.end();
					resolve();
				});
				readable.pipe(this.original,{
					end:false
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = HTTPResponse;

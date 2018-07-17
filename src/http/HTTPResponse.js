// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const QS = require("querystring");

const AbstractResponse = require("../AbstractResponse");

class HTTPResponse extends AbstractResponse {
	constructor(original) {
		super(original);
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
		return this.original.writeHead(statusCode,statusMessage,headers);
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

}

module.exports = HTTPResponse;

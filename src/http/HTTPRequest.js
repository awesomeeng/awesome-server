// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const QS = require("querystring");
const URL = require("url");

const AbstractRequest = require("../AbstractRequest");

const $CONTENT = Symbol("content");

class HTTPRequest extends AbstractRequest{
	constructor(request) {
		super(request);
	}

	get origin() {
		return this.original.socket && this.original.socket.remoteAddress && this.original.socket.remotePort && this.original.socket.remoteAddress+":"+this.original.socket.remotePort || this.headers.referer || this.headers.referrer || this.headers.origin || "";
	}

	get method() {
		return this.original.method;
	}

	get url() {
		return URL.parse(this.original.url,true);
	}

	get path() {
		return this.original.url;
	}

	get query() {
		return this.url.query;
	}

	get querystring() {
		return this.url.search.replace(/^\?/,"");
	}

	get headers() {
		return this.original.headers;
	}

	get contentType() {
		return this.headers && this.headers["content-type"] && this.headers["content-type"].replace(/^((.*);.*$|^(.*)$)/,"$2$3") || "";
	}

	get contentEncoding() {
		let parameters = this.headers && this.headers["content-type"] && this.headers["content-type"].replace(/^(.*;(.*)$|^.*$)/,"$2").trim() || "";
		return parameters && QS.parse(parameters).charset || "utf-8";
	}

	get useragent() {
		return this.headers["user-agent"] || "";
	}

	read() {
		if (this[$CONTENT]) return Promise.resolve(this[$CONTENT]);

		return new Promise((resolve,reject)=>{
			try {
				let buf = Buffer.alloc(0);
				this.original.on("data",(chunk)=>{
					if (!chunk) return;
					buf = Buffer.concat([buf,chunk]);
				});
				this.original.on("end",()=>{
					this[$CONTENT] = buf;
					resolve(buf);
				});
				this.original.resume();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = HTTPRequest;

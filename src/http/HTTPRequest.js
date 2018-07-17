// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const QS = require("querystring");
const URL = require("url");

const AbstractRequest = require("../AbstractRequest");

class HTTPRequest extends AbstractRequest{
	constructor(request) {
		super(request);
	}

	get origin() {
		return this.original.socket && this.original.socket.remoteAddress && this.original.socket.remotePort && this.original.socket.remoteAddress+":"+this.original.socket.remotePort || this.headers.referer || this.headers.referrer || this.headers.origin || "";
	}

	get hostname() {
		return this.original.socket && this.original.socket.localAddress || "";
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

	get content() {
		return new Promise((resolve,reject)=>{
			let data = null;

			try {
				this.original.once("end",()=>{
					resolve(data);
				});

				this.original.on("data",(chunk)=>{
					if (chunk===undefined || chunk===null) return;
					if (data===null) {
						data = chunk;
					}
					else if (typeof chunk==="string" && data instanceof Buffer) {
						data = Buffer.concat([data,Buffer.from(chunk,this.contentEncoding)]);
					}
					else if (typeof chunk==="string" && typeof data==="string") {
						data += chunk;
					}
					else if (chunk instanceof Buffer && data instanceof Buffer) {
						data = Buffer.concat([data,chunk]);
					}
					else if (chunk instanceof Buffer && typeof data==="string") {
						data += chunk.toString(this.contentEncoding);
					}
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

}

module.exports = HTTPRequest;

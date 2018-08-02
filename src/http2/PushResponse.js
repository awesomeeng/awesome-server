// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Readable = require("stream").Readable;

const Log = require("AwesomeLog");

const $PARENT = Symbol("parent");
const $STREAM = Symbol("stream");
const $HEADERS = Symbol("headers");

class PushResponse {
	static create(parent,headers) {
		return new Promise((resolve,reject)=>{
			try {
				parent.original.createPushResponse(headers||{},(err,stream,headers)=>{
					if (stream && stream.code && stream.code==="ERR_HTTP2_INVALID_STREAM") return reject("HTTP/2 Stream closed.");
					resolve(new PushResponse(parent,stream,headers));
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	constructor(parent,stream,headers={}) {
		if (!parent) throw new Error("Missing parent.");
		if (!stream) throw new Error("Missing stream.");
		if (!headers) throw new Error("Missing headers.");

		this[$PARENT] = parent;
		this[$STREAM] = stream;
		this[$HEADERS] = headers;

		this.stream.on("error",(err)=>{
			Log.warn("PushResponse","Push rejected for "+headers[":path"]+".",err);
		});
	}

	get parent() {
		return this[$PARENT];
	}

	get stream() {
		return this[$STREAM];
	}

	get headers() {
		return this[$HEADERS];
	}

	writeHead(statusCode,statusMessage,headers) {
		if (arguments.length===1) [statusCode,statusMessage,headers] = [statusCode,null,null];
		if (arguments.length===2) [statusCode,statusMessage,headers] = [statusCode,null,headers];

		headers = headers || {};

		return this.stream.writeHead(statusCode,statusMessage,headers);
	}

	write(data,encoding) {
		return new Promise((resolve,reject)=>{
			try {
				this.stream.write(data,encoding,(err)=>{
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
				this.stream.end(data,encoding,(err)=>{
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
				readable.on("end",()=>{
					this.end();
					resolve();
				});
				readable.pipe(this.stream,{
					end:false
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = PushResponse;

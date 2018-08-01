// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

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

	writeHead(/*statusCode,statusMessage,headers*/) {
		throw new Error("To be implemented by subclass.");
	}

	write(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
	}

	end(/*data,encoding*/) {
		throw new Error("To be implemented by subclass.");
	}

	writeJSON(json) {
		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(200,null,{
					"Content-Type":"application/json"
				});
				if (typeof json!=="string") json = JSON.stringify(json);
				await this.write(json);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeText(text) {
		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(200,null,{
					"Content-Type":"text/plain"
				});
				await this.write(text);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeCSS(css) {
		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(200,null,{
					"Content-Type":"text/css"
				});
				await this.write(css);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeHTML(html) {
		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(200,null,{
					"Content-Type":"text/html"
				});
				await this.write(html);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}

	writeError(statusCode,message) {
		return new Promise(async (resolve,reject)=>{
			try {
				this.writeHead(statusCode,null,{
					"Content-Type": "text/plain"
				});
				await this.write(message);
				await this.end();

				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	}
}

module.exports = AbstractResponse;

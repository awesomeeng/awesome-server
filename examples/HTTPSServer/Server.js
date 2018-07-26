// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Log = require("AwesomeLog");
Log.init();
Log.start();

const AwesomeServer = require("../../src/AwesomeServer");

// generate a keypair/cert
// from here: https://stackoverflow.com/a/31624843
const Forge = require("node-forge");
let keys = Forge.pki.rsa.generateKeyPair(2048);
let cert = Forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
var attrs = [{
	name: 'commonName',
	value: 'localhost'
},{
	name: 'countryName',
	value: 'ANY'
},{
	shortName: 'ST',
	value: 'Anywhere'
},{
	name: 'localityName',
	value: 'Anywhere'
},{
	name: 'organizationName',
	value: 'Test'
},{
	shortName: 'OU',
	value: 'Test'
}];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);
let publicKey = Forge.pki.certificateToPem(cert);
let privateKey = Forge.pki.privateKeyToPem(keys.privateKey);

let server = new AwesomeServer();
server.addHTTPSServer({
	hostname: "localhost",
	port: 7443,
	cert: publicKey,
	key: privateKey
});
server.router.add("*","/hello",(request,response)=>{
	response.writeText("Hello world.");
});
server.start();

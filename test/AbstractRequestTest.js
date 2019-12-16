// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AbstractRequest = require("../src/AbstractRequest");
describe("AbstractRequest",function(){
	it("positional",function(){
		let req = new AbstractRequest();

		assert.deepStrictEqual(req.positional(":id","123"),{
			id:"123"
		});
		assert.deepStrictEqual(req.positional("/:id","/123"),{
			id:"123"
		});
		assert.deepStrictEqual(req.positional("/test/:id","/test/123"),{
			id:"123"
		});
		assert.deepStrictEqual(req.positional("/test/:id/:value","/test/123/abc"),{
			id:"123",
			value:"abc"
		});
		assert.deepStrictEqual(req.positional("/test/:id,:value","/test/123,abc"),{
			id:"123",
			value:"abc"
		});
		assert.deepStrictEqual(req.positional("/test/:a/:b/:c/:d/:e/:f/:g/:h/:i/:j/:k/:l/:m/:n/:o/:p/:q/:r/:s/:t/:u/:v/:w/:x/:y/:z","/test/1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19/20/21/22/23/24/25/26"),{
			a:"1",
			b:"2",
			c:"3",
			d:"4",
			e:"5",
			f:"6",
			g:"7",
			h:"8",
			i:"9",
			j:"10",
			k:"11",
			l:"12",
			m:"13",
			n:"14",
			o:"15",
			p:"16",
			q:"17",
			r:"18",
			s:"19",
			t:"20",
			u:"21",
			v:"22",
			w:"23",
			x:"24",
			y:"25",
			z:"26"
		});
		assert.deepStrictEqual(req.positional("/test/:a,:b,:c,:d,:e,:f,:g,:h,:i,:j,:k,:l,:m,:n,:o,:p,:q,:r,:s,:t,:u,:v,:w,:x,:y,:z","/test/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26"),{
			a:"1",
			b:"2",
			c:"3",
			d:"4",
			e:"5",
			f:"6",
			g:"7",
			h:"8",
			i:"9",
			j:"10",
			k:"11",
			l:"12",
			m:"13",
			n:"14",
			o:"15",
			p:"16",
			q:"17",
			r:"18",
			s:"19",
			t:"20",
			u:"21",
			v:"22",
			w:"23",
			x:"24",
			y:"25",
			z:"26"
		});
	});
});

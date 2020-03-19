//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Build - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';

const fakeGauge = require('./fakeGauge');


const fakeChalkClosure = (text) => {
	return text;
};

const fakeTerminal = {
	echo: jest.fn(),
	spacer: jest.fn(),
	startProgress: jest.fn(() => {
		return fakeGauge;
	}),
	chalk: {
		blue: jest.fn(fakeChalkClosure),
		green: jest.fn(fakeChalkClosure),
		red: jest.fn(fakeChalkClosure)
	}
};


module.exports = fakeTerminal;

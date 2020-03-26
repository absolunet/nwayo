//--------------------------------------------------------
//-- Nwayo Core - Test - Unit - Console - Commands - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';


const fakeTerminal = {
	_promptAnswers: [],
	_prompt: jest.fn(async () => {
		await new Promise(setTimeout);

		return fakeTerminal._promptAnswers.shift();
	}),
	println: jest.fn(),
	success: jest.fn(),
	ask: jest.fn(() => {
		return fakeTerminal._prompt();
	}),
	secret: jest.fn(() => {
		return fakeTerminal._prompt();
	}),
	confirm: jest.fn(() => {
		return fakeTerminal._prompt();
	}),
	choice: jest.fn(() => {
		return fakeTerminal._prompt();
	})
};


module.exports = fakeTerminal;

//--------------------------------------------------------
//-- Nwayo - Test - Unit - Console - Commands - Stubs - Fake Terminal
//--------------------------------------------------------
'use strict';


const fakeTerminal = {
	println: jest.fn(),
	warning: jest.fn(),
	success: jest.fn()
};


module.exports = fakeTerminal;

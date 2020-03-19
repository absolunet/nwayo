//--------------------------------------------------------
//-- Nwayo - Test - Unit - Console - Commands - Stubs - Fake Translator
//--------------------------------------------------------
'use strict';


const fakeTranslator = {
	translate: jest.fn((key) => {
		return `Translated: ${key}`;
	})
};


module.exports = fakeTranslator;

//--------------------------------------------------------
//-- nwayo - Test - Unit - Mixins - Stubs - Fake Translator
//--------------------------------------------------------
'use strict';


const fakeTranslator = {
	translate: jest.fn((key) => {
		return key;
	})
};


module.exports = fakeTranslator;

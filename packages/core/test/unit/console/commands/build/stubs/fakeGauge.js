//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - Build - Stubs - Fake Gauge
//--------------------------------------------------------
'use strict';


const fakeGauge = {
	show:    jest.fn(),
	pulse:   jest.fn(),
	disable: jest.fn()
};


module.exports = fakeGauge;

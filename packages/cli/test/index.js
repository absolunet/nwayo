//--------------------------------------------------------
//-- nwayo - Test
//--------------------------------------------------------
'use strict';

const { Tester } = require('@absolunet/tester');


const tester = new Tester({
	nameScope: '@nwayo'
});


tester.init({
	repositoryType: 'sub-package',
	packageType:    'ioc'
});

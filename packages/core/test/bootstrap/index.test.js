//--------------------------------------------------------
//-- Nwayo core - Test - Bootstrapper
//--------------------------------------------------------
'use strict';


// Load the application and the tester class.
const { Application, Tester } = require('@absolunet/ioc');
const bootstrap               = require('../../bootstrap');


// Retrieve environment variables to pass to the tester instance.
const { TEST_ENGINE, TEST_REPOSITORY } = process.env; // eslint-disable-line no-process-env


// Create new application.
const app = Application.make();


// Bootstrap the application, and make sure it does not handle the current request.
bootstrap(app, false);


// Instantiate the tester.
const tester = app.make(Tester);


// Boot the tester, set the engine from environment configuration and run the given test suite.
tester.boot();
tester.setEngine(TEST_ENGINE);
tester.run(TEST_REPOSITORY, (testApp) => {
	bootstrap(testApp, false);
});

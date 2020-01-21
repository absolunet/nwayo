//--------------------------------------------------------
//-- Node IoC Extension - Bootstrap
//--------------------------------------------------------
'use strict';

const { ConsoleKernel, ExceptionHandler } = require('@absolunet/ioc');
const ExtensionServiceProvider            = require('.');


module.exports = async (app, shouldHandleRequest = true) => {

	// Bind main handlers.
	app.singleton('kernel',            ConsoleKernel);
	app.singleton('exception.handler', ExceptionHandler);


	//  Make the console kernel.
	const kernel = app.make('kernel');


	// Register extension service provider.
	app.register(ExtensionServiceProvider);


	// Configure extension paths
	app.useAppPath(app.formatPath(''));
	app.configurePaths({
		'bootstrap':     app.distributionPath(''),
		'src.bootstrap': app.sourcePath('')
	});


	// Boot the application.
	app.bootIfNotBooted();


	// Handle the request the default way.
	if (shouldHandleRequest) {
		try {
			await kernel.handle();
		} catch (error) {
			app.make('exception.handler').handle(error);
		} finally {
			kernel.terminate();
		}
	}

};

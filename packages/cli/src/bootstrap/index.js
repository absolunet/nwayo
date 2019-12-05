//--------------------------------------------------------
//-- Nwayo - Bootstrap
//--------------------------------------------------------

import './mixins';
import handlers  from './handlers';
import lifecycle from './lifecycle';


export default async (app, shouldHandleRequest = true) => {

	// Use the application root folder as base path.
	// Since this file will be compiled into "dist/node", one level deeper than "src"
	// we must consider this path instead of the current one.
	app.useBasePath(app.formatPath(__dirname, '..', '..', '..'));


	// Use context of the module that required this file
	app.setContext(module.parent);


	// Bootstrap the main application handlers, which are the application kernel and the exception handler.
	handlers(app);


	// Initialize the lifecycle and await for its termination.
	await lifecycle(app, shouldHandleRequest);

};

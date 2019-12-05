//--------------------------------------------------------
//-- Nwayo - Bootstrap - Handlers
//--------------------------------------------------------

import ConsoleKernel    from '../app/console/Kernel';
import ExceptionHandler from '../app/exceptions/Handler';


export default (app) => {

	// Define application kernel.
	app.singleton('kernel', ConsoleKernel);

	// Define exception handler.
	app.singleton('exception.handler', ExceptionHandler);

};

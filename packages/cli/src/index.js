//--------------------------------------------------------
//-- Nwayo
//--------------------------------------------------------

// Import Node IoC application class.
import { Application } from '@absolunet/ioc';


// Import application bootstrapper.
import bootstrap from './bootstrap';


// Create the application instance.
const app = Application.getInstance();


// Bootstrap the application.
bootstrap(app);


// Expose the application.
export default app;

//--------------------------------------------------------
//-- Nwayo Core
//--------------------------------------------------------

// Load the main service provider.
import CoreServiceProvider from './CoreServiceProvider';


// Load abstract classes to be used by other extensions.
import AbstractBuildCommand from './console/commands/build/AbstractBuildCommand';


// Export the service provider to be registered by an IoC application.
export default CoreServiceProvider;


// Expose classes to be used by other extensions.
export {
	AbstractBuildCommand
};

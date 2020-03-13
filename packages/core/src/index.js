//--------------------------------------------------------
//-- Nwayo Core
//--------------------------------------------------------

// Load mixins.
import './mixins';


// Load the main service provider.
import CoreServiceProvider from './CoreServiceProvider';


// Load abstract classes to be used by other extensions.
import AbstractBuildCommand from './console/commands/build/AbstractBuildCommand';
import Command              from './console/Command';
import Handler              from './handlers/Handler';


// Export the service provider to be registered by an IoC application.
export default CoreServiceProvider;


// Expose classes to be used by other extensions.
export {
	AbstractBuildCommand,
	Command,
	Handler
};

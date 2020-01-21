//--------------------------------------------------------
//-- Node IoC - Console - Command - Build - Build All
//--------------------------------------------------------

import AbstractBuildCommand from './AbstractBuildCommand';


/**
 * Command that run all build types.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments nwayo.core.console.commands.build.AbstractBuildCommand
 * @hideconstructor
 */
class BuildAllCommand extends AbstractBuildCommand {

	/**
	 * @inheritdoc
	 */
	get policies() {
		return [];
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return 'Run all build commands.';
	}

}


export default BuildAllCommand;

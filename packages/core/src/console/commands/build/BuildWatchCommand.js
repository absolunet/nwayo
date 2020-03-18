//--------------------------------------------------------
//-- Nwayo Core - Console - Command - Build - Build Watch
//--------------------------------------------------------

import AbstractBuildCommand from './AbstractBuildCommand';


/**
 * Command that run all build types and watch for file changes to rebuild.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments nwayo.core.console.commands.build.AbstractBuildCommand
 * @hideconstructor
 */
class BuildWatchCommand extends AbstractBuildCommand {

	/**
	 * @inheritdoc
	 */
	get policies() {
		return [];
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return (super.options || []).concat([
			['type',  'all', this.t('commands.build-watch.options.type')]
		]);
	}

	/**
	 * Get the build type(s).
	 *
	 * @returns {string|Array<string>} The build type(s).
	 */
	getBuildTypes() {
		const types = (this.option('type') || '').split(',')
			.map((type) => {
				return type.trim();
			})
			.filter((type) => {
				return type !== this.nwayoBuildType.WATCH;
			});

		if (types.includes(this.nwayoBuildType.ALL)) {
			return this.nwayoBuildType.ALL;
		}

		return types;
	}

	/**
	 * Get nwayo build arguments.
	 *
	 * @returns {Array<*>} The nwayo build arguments.
	 */
	getBuildArguments() {
		const [type, bundles, options = {}, ...parameters] = super.getBuildArguments();
		const watchOptions = Object.assign(typeof options === 'object' && options ? options : {}, { watch: true });

		return [type, bundles, watchOptions, ...parameters];
	}

}


export default BuildWatchCommand;

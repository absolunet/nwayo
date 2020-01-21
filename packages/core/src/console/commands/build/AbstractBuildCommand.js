//--------------------------------------------------------
//-- Node IoC - Console - Command - Build - Abstract Build
//--------------------------------------------------------

import { Command, NotImplementedError } from '@absolunet/ioc';


/**
 * Abstract build command that handles by calling <code>nwayo.build()</code> with the appropriate type.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments ioc.console.Command
 * @hideconstructor
 * @abstract
 */
class AbstractBuildCommand extends Command {

	/**
	 * Class dependencies: <code>['nwayo', 'nwayo.build.type', 'helper.string']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['nwayo', 'nwayo.build.type', 'helper.string'];
	}

	/**
	 * @inheritdoc
	 */
	get policies() {
		return [`nwayo.build:${this.type}`];
	}

	/**
	 * Build type name.
	 * By default, it will use the class name to guess the type ID.
	 *
	 * @example
	 * class BuildFooBarCommand extends AbstractBuildCommand {}
	 * // Type ID => "FOO_BAR"
	 * // Type name => app.make('nwayo.build.type').get('FOO_BAR'); => 'foo-bar'
	 * app.make(BuildFooBarCommand).type; // 'foo-bar'
	 *
	 * @type {string}
	 */
	get type() {
		const { name } = this.constructor;

		if (name && name !== AbstractBuildCommand.name) {
			const type = this.stringHelper.constant(name.replace(/^Build(?<type>[A-Z][A-Za-z]+)Command$/u, '$<type>'));

			if (this.nwayoBuildType.has(type)) {
				return this.nwayoBuildType.get(type);
			}
		}

		throw new NotImplementedError(this, 'type', 'string', 'accessor');
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return `build:${this.type}`;
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return `Build ${this.type}.`;
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [
			['bundle', null, 'Specific bundle to build.']
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		await this.build();
	}

	/**
	 * Build the command type.
	 *
	 * @see {nwayo.core.commands.AbstractBuildCommand#type}
	 * @returns {Promise} The async process promise.
	 */
	async build() {
		this.debug(`Build start: ${this.type}`);

		const bundles = this.getBundles();

		if (Array.isArray(bundles) && bundles.length > 0) {
			this.debug(`Build for bundles [${bundles.join(', ')}].`);
		} else {
			this.debug('Building for all bundles.');
		}

		await this.nwayo.build(...this.getBuildArguments());
	}

	/**
	 * Get build type(s).
	 *
	 * @returns {string|Array<string>} The build type(s).
	 */
	getBuildTypes() {
		return this.type;
	}

	/**
	 * Get bundles to build.
	 *
	 * @returns {Array<string>|null} The bundles list.
	 */
	getBundles() {
		const bundles = this.option('bundle');

		if (!bundles) {
			return null;
		}

		return bundles.split(',').map((bundle) => {
			return bundle.trim();
		});
	}

	/**
	 * Get nwayo.build() arguments.
	 *
	 * @returns {Array<*>} The nwayo.build() arguments.
	 */
	getBuildArguments() {
		return [
			this.getBuildTypes(),
			this.getBundles()
		];
	}

	/**
	 * String helper.
	 *
	 * @type {ioc.support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

}


export default AbstractBuildCommand;

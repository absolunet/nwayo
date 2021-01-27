//--------------------------------------------------------
//-- Nwayo Core - Console - Command - Build - Abstract Build
//--------------------------------------------------------

import { Command, NotImplementedError, mixins } from '@absolunet/ioc';


/**
 * Abstract build command that handles by calling <code>nwayo.build()</code> with the appropriate type.
 *
 * @memberof nwayo.core.console.commands.build
 * @augments ioc.console.Command
 * @hideconstructor
 * @abstract
 */
class AbstractBuildCommand extends mixins.checksTypes(Command) {

	/**
	 * Class dependencies: <code>['helper.date', 'helper.string', 'nwayo.build-type']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['helper.date', 'helper.string', 'nwayo.build-type']);
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
			if (this.buildTypeRepository)
			return this.stringHelper.lower(name.replace(/^Build(?<type>[A-Z][A-Za-z]+)Command$/u, '$<type>'));
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
		return this.t(`commands.build-${this.type}.description`);
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [
			['bundle', null, this.t('commands.build-abstract.options.bundle')]
		];
	}

	/**
	 * @inheritdoc
	 */
	get flags() {
		return [
			['watch', 'Watch files for changes to trigger a compilation.'],
			['watch-poll', 'Watch files with the polling strategy for performance. To be used on large projects.'],
			['production', 'Compile for production.'],
			['analyze', 'Produce a bundle analysis report at the end of the process.']
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const crossEnvBinaryFile    = this.resolveModuleFilePath('cross-env', ['src', 'bin', 'cross-env.js']);
		const webpackBinaryFilePath = this.resolveModuleFilePath('webpack', ['bin', 'webpack.js']);
		const webpackConfigFilePath = this.resolveModuleFilePath('@nwayo/api', ['dist', 'node', 'setup', 'webpack.config.js']);

		const isProduction = this.flag('production');
		const isWatching   = !isProduction && (this.flag('watch') || this.flag('watch-poll'));
		const isPolling    = isWatching && this.flag('watch-poll');
		const isAnalyzing  = isWatching && this.flag('analyze');
		const verboseLevel = this.verbose;

		const buildTypes = this.getTypes();
		const bundles    = this.getBundles();

		const nodeEnvironment = isProduction ? 'production'          : 'development';
		const progressFlag    = isProduction ? '--no-progress'       : '--progress';
		const watchFlag       = isWatching   ? '--watch'             : '';
		const pollFlag        = isPolling    ? '--watch-poll=1000'   : '';
		const analyzeFlag     = isAnalyzing  ? '--env.nwayo.analyze' : '';

		const parameters = [
			crossEnvBinaryFile,
			`NODE_ENV=${nodeEnvironment}`,
			webpackBinaryFilePath,
			'--hide-modules',
			`--config=${webpackConfigFilePath}`,
			analyzeFlag,
			...buildTypes.map((buildType) => {
				return `--env.nwayo.type=${buildType}`;
			}),
			`--env.nwayo.verbose=${verboseLevel}`,
			progressFlag,
			watchFlag,
			pollFlag
		].filter(Boolean);

		await Promise.all(bundles.map(async (bundleName) => {
			await this.run([...parameters, `--env.nwayo.bundle=${bundleName}`])
		}));
	}

	/**
	 * Resolve the given module file path, and append the given path segments.
	 *
	 * @param {string} moduleName - The module name, which should be located in node_modules.
	 * @param {Array<string>} pathSegments - The path segments to append to the resolved path.
	 * @returns {string} The resolved module file path.
	 */
	resolveModuleFilePath(moduleName, pathSegments = []) {
		return this.pathHelper.join(process.cwd(), 'node_modules', moduleName, ...pathSegments);
	}

	/**
	 * Get all build types that should be compiled.
	 *
	 * @returns {Array<string>} The build types that should be compiled.
	 */
	getTypes() {
		const { type } = this;

		if (type === 'all') {
			return this.buildTypeRepository.all()
		}

		return [type];
	}

	/**
	 * Get all available bundles.
	 *
	 * @returns {Array<string>} The available bundle names.
	 */
	getBundles() {
		const bundles = this.app.make('nwayo.project').getBundles();

		const bundle = this.option('bundle');

		if (bundle) {
			if (!bundles.includes(bundle)) {
				throw new Error(`Bundle [${bundle}] does not exist.`);
			}

			return [bundle];
		}

		return bundles;
	}

	/**
	 * String helper.
	 *
	 * @type {ioc.support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

	/**
	 * Path helper.
	 *
	 * @type {ioc.support.helpers.PathHelper}
	 */
	get pathHelper() {
		return this.helperPath;
	}

	/**
	 * Build type repository.
	 *
	 * @type {nwayo.core.repositories.BuildTypeRepository}
	 */
	get buildTypeRepository() {
		return this.nwayoBuildType;
	}

}


export default AbstractBuildCommand;

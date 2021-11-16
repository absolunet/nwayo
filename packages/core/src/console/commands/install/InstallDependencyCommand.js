//--------------------------------------------------------
//-- Nwayo Core - Console - Command - Install - Install Components
//--------------------------------------------------------

import Command from '../../Command';


/**
 * Command that installs a dependency into a component.
 *
 * @memberof nwayo.core.console.commands.install
 * @augments ioc.console.Command
 * @hideconstructor
 */
class InstallDependencyCommand extends Command {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'install:dependency';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return this.t('commands.install-dependency.description');
	}

	/**
	 * @inheritdoc
	 */
	get parameters() {
		return [
			['dependency', false, null, this.t('commands.install-dependency.parameters.dependency')],
			['component',  false, null, this.t('commands.install-dependency.parameters.component')]
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const parameters = await this.resolveParameters();

		this.info(this.t('commands.install-dependency.messages.start', parameters));

		await this.installDependency(parameters);

		this.success(this.t('commands.install-dependency.messages.completed'));
	}

	/**
	 * Resolve parameters by getting given parameters and by prompting for missing values.
	 *
	 * @returns {Promise<{dependency: string, version: string, component: string, path: string}>} The resolved parameter values.
	 */
	async resolveParameters() {
		const { dependency, version } = await this.resolveDependencyAndVersion();
		const { component, path }     = await this.resolveComponentAndPath();

		return { dependency, version, component, path };
	}

	/**
	 * Resolve the dependency name and version.
	 * If the dependency was not given, prompt for the dependency name.
	 * If the dependency version was given through the "@" delimiter,
	 * such as "jquery@3.4.1", it returns the pared value.
	 * If the dependency version was not given, it asks to choose between
	 * retrieved versions of the given dependency through the dependency manager driver.
	 *
	 * @returns {Promise<{dependency: string, version: string}>} The dependency name and version.
	 * @throws {Error} Indicates that the dependency was not found by the dependency manager.
	 * @throws {TypeError} Indicates that the dependency version does not exist.
	 */
	async resolveDependencyAndVersion() {
		let dependency = this.parameter('dependency');
		let version;

		if (!dependency) {
			dependency = await this.ask(this.t('commands.install-dependency.messages.choose-dependency'));
		}

		const versionIndex = dependency.lastIndexOf('@');

		if (versionIndex > 0) {
			version    = dependency.slice(versionIndex + 1);
			dependency = dependency.slice(0, versionIndex);
		}

		const availableVersions = await this.app.make('dependency')
			.inFolder(this.app.make('nwayo.project').getSourcePath())
			.getAvailableVersions(dependency);

		availableVersions.reverse();

		if (!version) {
			version = await this.choice(this.t('commands.install-dependency.messages.choose-version'), availableVersions);
		}

		if (!availableVersions.includes(version)) {
			throw new TypeError(`The package "${dependency}] does not have the version [${version}].`);
		}

		return { dependency, version };
	}

	/**
	 * Resolve the component name and absolute path.
	 * If the component was not given, it asks for a choice
	 * from the list given by the component repository.
	 *
	 * @returns {Promise<{path: string, component: string}>} The component name and absolute path.
	 * @throws {TypeError} Indicates that the component does not exist.
	 */
	async resolveComponentAndPath() {
		const projectService   = this.app.make('nwayo.project');
		const componentMapping = await this.app.make('nwayo.project.component').all();
		const components       = Object.keys(componentMapping);

		let component = this.parameter('component');

		if (!component) {
			component = await this.choice(this.t('commands.install-dependency.messages.choose-component'), components);
		}

		const { defaultNamespace } = projectService;

		if (!component.startsWith('@') && !component.startsWith(defaultNamespace)) {
			component = `${defaultNamespace}/${component}`;
		}

		if (!components.includes(component)) {
			throw new TypeError(`Component [${component}] does not exist.`);
		}

		const [, componentFolderName] = component.split('/');

		return {
			component,
			path: projectService.getComponentPath(componentFolderName)
		};
	}

	/**
	 * Install dependency in the given components.
	 *
	 * @param {object<string, string>} parameters - The parameters of the dependency installation.
	 * @param {string} parameters.dependency - The dependency name.
	 * @param {string} parameters.version - The dependency version.
	 * @param {string} parameters.path - The component absolute path.
	 * @returns {Promise} The async process promise.
	 */
	async installDependency({ dependency, version, path }) {
		await this.app.make('dependency')
			.inFolder(path)
			.save(dependency, version);

		await this.call('install:components');
	}

}


export default InstallDependencyCommand;

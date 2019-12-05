//--------------------------------------------------------
//-- Nwayo core - Services - Dependency Manager - Drivers - NPM Driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * Driver that uses NPM as concrete dependency manager.
 *
 * @memberof nwayo.core.services.DependencyManager.drivers
 * @augments nwayo.core.services.DependencyManager.drivers.Driver
 * @hideconstructor
 */
class NpmDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	async install() {
		await this.run('npm install');
	}

	/**
	 * @inheritdoc
	 */
	async add(packageName, version) {
		await this.run(`npm install ${packageName}${version ? `@${version}` : ''}`);
	}

	/**
	 * @inheritdoc
	 */
	async remove(packageName) {
		await this.run(`npm uninstall ${packageName}`);
	}

	/**
	 * @inheritdoc
	 */
	async update(packageName, version) {
		if (version) {
			await this.remove(packageName);
			await this.install(packageName, version);
		} else {
			await this.run(`npm update ${packageName}`);
		}
	}

}


export default NpmDriver;

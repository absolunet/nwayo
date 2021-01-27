//--------------------------------------------------------
//-- Nwayo Core - Repositories - Project Components Repository
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Build type repository.
 *
 * @memberof nwayo.core.repositories
 * @hideconstructor
 */
class BuildTypeRepository {

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set({
			types: new Set()
		});
	}

	/**
	 * Get all available build types.
	 *
	 * @returns {Array<string>} The available build types.
	 */
	all() {
		return [...__(this).get('types')];
	}

	/**
	 * Check if the given type is available.
	 *
	 * @param {string} type - The build type to check.
	 * @returns {boolean} Indicates that the build type is available.
	 */
	has(type) {
		return __(this).get('types').has(type);
	}

	/**
	 * Add a given build type
	 * @param {string|Array<string>} type - The build type to add.
	 * @returns {BuildTypeRepository} The current BuildTypeRepository instance.
	 */
	add(type) {
		const types = Array.isArray(type) ? type : [type];
		const _types = __(this).get('types');

		types.forEach(_types.add.bind(_types));

		return this;
	}

}


export default BuildTypeRepository;

//--------------------------------------------------------
//-- Nwayo Core - Policies - Nwayo Build
//--------------------------------------------------------


/**
 * Nwayo Build Policy.
 *
 * @memberof nwayo.core.policies
 * @hideconstructor
 */
class NwayoBuildPolicy {

	/**
	 * Class dependencies: <code>['nwayo']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['nwayo'];
	}

	/**
	 * Policy name.
	 *
	 * @type {string}
	 */
	get name() {
		return 'nwayo.build';
	}

	/**
	 * Test if policy passes.
	 *
	 * @param {...*} types - The sent types.
	 * @returns {boolean} Indicates that the policy fails.
	 */
	passes(...types) {
		const phases = [
			this.nwayo.phases.preprocess,
			this.nwayo.phases.process,
			this.nwayo.phases.postprocess
		];

		return types.reduce((authorized, type) => {
			return authorized && phases.reduce((result, phase) => {
				return result || this.nwayo.hasHook(type, phase);
			}, false);
		}, true);
	}

}


export default NwayoBuildPolicy;

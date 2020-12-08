'use strict';

const yargs = require('yargs');


/**
 * Context of the current build.
 *
 * @memberof nwayo.api
 */
class Context {

	/**
	 * Context constructor.
	 *
	 * @param {object} [argv=yargs.argv] - The CLI arguments. Will be the ones parsed by Yargs by default.
	 */
	constructor(argv = yargs.argv) {
		this.argv = argv;
		this.setBundle(null);
	}

	/**
	 * Set current bundle being processed.
	 *
	 * @param {string|null} bundle - The bundle name.
	 * @returns {nwayo.api.Context} The current Context instance.
	 */
	setBundle(bundle) {
		this._bundle = bundle;

		return this;
	}

	/**
	 * Nwayo arguments.
	 *
	 * @type {object}
	 */
	get nwayo() {
		return (this.argv.env || {}).nwayo || {};
	}

	/**
	 * Name of the bundles to be compiled.
	 *
	 * @type {Array<string>}
	 */
	get bundles() {
		const { bundle = [] } = this.nwayo;

		return Array.isArray(bundle) ? bundle : [bundle];
	}

	/**
	 * Build types to be compiled.
	 *
	 * @type {Array<"scripts"|"styles"|"assets">}
	 */
	get buildTypes() {
		const { type = [] } = this.nwayo;

		return Array.isArray(type) ? type : [type];
	}

	/**
	 * Indicates that the compiled bundles should be analyzed after the compile process.
	 *
	 * @type {boolean}
	 */
	get shouldAnalyze() {
		return Boolean(this.nwayo.analyze);
	}

	/**
	 * Current bundle being processed.
	 *
	 * @type {string|null}
	 */
	get bundle() {
		return this._bundle;
	}

}


module.exports = new Context();

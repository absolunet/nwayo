import path  from 'path';
import slash from 'slash';


/**
 * Path utilities.
 *
 * @memberof nwayo.api
 */
class Paths {

	/**
	 * Get the path from the given bundle name.
	 *
	 * @param {string} bundle - The bundle name.
	 * @returns {string} The path to the bundle root directory.
	 */
	bundle(bundle) {
		return this.format(this.bundlesRoot, bundle);
	}

	/**
	 * Get the path to the specified bundle's Webpack file.
	 *
	 * @param {string} bundle - The bundle name.
	 * @returns {string} The path to the bundle's Webpack file.
	 */
	bundleWebpackFile(bundle) {
		return this.format(this.bundle(bundle), this.webpackFileName);
	}

	/**
	 * Format path for all OS.
	 *
	 * @param {...string} pathSegments - The path segments to format.
	 * @returns {string} The formatted path.
	 */
	format(...pathSegments) {
		return slash(path.join(...pathSegments));
	}

	/**
	 * The project root path.
	 *
	 * @type {string}
	 */
	get root() {
		return this.format(process.cwd());
	}

	/**
	 * The bundles root path.
	 *
	 * @type {string}
	 */
	get bundlesRoot() {
		return this.format(this.root, 'src', 'bundles');
	}

	/**
	 * The Webpack file name.
	 *
	 * @type {string}
	 */
	get webpackFileName() {
		return 'webpack.nwayo.js';
	}

}


export default new Paths();

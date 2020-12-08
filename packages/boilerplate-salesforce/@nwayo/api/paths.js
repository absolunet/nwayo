'use strict';

const path  = require('path');
const slash = require('slash');


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
	 * Get the directory name of a given path segment.
	 *
	 * @param {string} pathSegment - The path segment.
	 * @returns {string} The directory path.
	 */
	dirname(pathSegment) {
		return this.format(path.dirname(pathSegment));
	}

	/**
	 * Get the formatted relative path from one location to the other.
	 *
	 * @param {string} from - The starting path.
	 * @param {string} to - The destination path.
	 * @returns {string} The relative path.
	 */
	relative(from, to) {
		return slash(path.relative(from, to));
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
	 * The source code root path.
	 *
	 * @type {string}
	 */
	get source() {
		return this.format(this.root, 'src');
	}

	/**
	 * The bundles root path.
	 *
	 * @type {string}
	 */
	get bundlesRoot() {
		return this.format(this.source, 'bundles');
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


module.exports = new Paths();

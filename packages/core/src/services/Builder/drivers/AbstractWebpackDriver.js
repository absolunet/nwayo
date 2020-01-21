//--------------------------------------------------------
//-- Nwayo Core - Services - Builder - Drivers - Abstract Webpack Driver
//--------------------------------------------------------

import readline from 'readline';
import Driver   from './Driver';


/**
 * Abstract driver that uses Webpack as builder engine.
 *
 * @memberof nwayo.core.services.Builder.drivers
 * @augments nwayo.core.services.Builder.drivers.Driver
 * @hideconstructor
 * @abstract
 */
class AbstractWebpackDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	async run(config) {
		const builder = this.getBuilder(config);

		await new Promise((resolve, reject) => {
			builder.run((error, stats) => {
				if (error || stats.hasErrors()) {
					reject({ error, stats }); // eslint-disable-line prefer-promise-reject-errors

					return;
				}

				resolve({ stats });
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	async watch(config, options) {
		const builder       = this.getBuilder(config);
		const watcher       = builder.watch(typeof options === 'object' && options ? options : undefined, () => {}); // eslint-disable-line no-empty-function

		await new Promise((resolve) => {
			const closeWatcher = () => {
				watcher.close(resolve);
			};

			if (process.platform === 'win32') {
				const rl = readline.createInterface({
					input:  process.stdin,
					output: process.stdout
				});

				rl.once('SIGINT', closeWatcher);
			}

			process.once('SIGINT', closeWatcher);
		});
	}

	/**
	 * Get a Webpack builder instance made from the given configuration object.
	 *
	 * @param {object|Array<object>} config - The Webpack configuration object.
	 * @param {object} [parameters={}] - The factory parameters.
	 * @param {boolean} [parameters.progress=false] - Indicates that the output should show progress.
	 * @returns {webpack} The Webpack builder instance.
	 */
	getBuilder(config, { progress = false } = {}) {
		const builder = this.webpack(config);

		builder.plugin('done', this.getAfterBuild());

		if (progress) {
			new this.webpack.ProgressPlugin({}).apply(builder);
		}

		return builder;
	}

	/**
	 * Webpack.
	 *
	 * @type {Function}
	 */
	get webpack() {
		return require('webpack'); // eslint-disable-line global-require
	}

}


export default AbstractWebpackDriver;

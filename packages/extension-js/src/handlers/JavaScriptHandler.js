//--------------------------------------------------------
//-- Nwayo Extension - JS - Handlers - JavaScript Handler
//--------------------------------------------------------

import { Handler } from '@nwayo/core';


/**
 * JavaScript handler.
 *
 * @memberof nwayo.extension.js.handlers
 * @augments nwayo.core.handlers.Handler
 * @hideconstructor
 */
class JavaScriptHandler extends Handler {

	/**
	 * @inheritdoc
	 */
	get type() {
		return this.nwayoBuildType.SCRIPTS;
	}

	/**
	 * Process hook.
	 *
	 * @param {nwayo.core.services.Builder} builder - The builder.
	 * @param {nwayo.core.BundleModel} bundle - The current bundle data.
	 */
	process(builder, { files, outputPath }) {
		files
			.filter((file) => {
				return (/^scripts\/.*\.(?:vue|js)$/u).test(file.localPath);
			})
			.forEach(({ localPath, path }) => {
				builder.addEntry('javascript', {
					source:      path,
					destination: this.app.formatPath(outputPath, localPath).replace(/\.(?:vue|js)$/u, '.js')
				});
			});
	}

}


export default JavaScriptHandler;

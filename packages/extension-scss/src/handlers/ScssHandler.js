//--------------------------------------------------------
//-- Nwayo Extension - SCSS - Handlers - SCSS Handler
//--------------------------------------------------------

import { Handler } from '@nwayo/core';


/**
 * SCSS Handler.
 *
 * @memberof nwayo.extension.scss.handlers
 * @augments nwayo.core.handlers.Handler
 * @hideconstructor
 */
class ScssHandler extends Handler {

	/**
	 * @inheritdoc
	 */
	get type() {
		return this.nwayoBuildType.STYLES;
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
				return (/^styles\/.*\.scss$/u).test(file.localPath);
			})
			.forEach(({ localPath, path }) => {
				builder.addEntry('scss', {
					source:      path,
					destination: this.app.formatPath(outputPath, localPath).replace(/\.scss$/u, '.css')
				});
			});
	}

}


export default ScssHandler;

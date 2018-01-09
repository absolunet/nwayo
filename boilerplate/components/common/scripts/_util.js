//-------------------------------------
//-- Common - Util
//-------------------------------------

(() => {
	'use strict';

	app.util = class {

		/**
		//-- Show html via reveal
		static showViaReveal(id, content) {
			const $modal = $(app.tmpl.commonRevealHtml.render({ id, content }));
			const modal = new Foundation.Reveal($modal);
			__.$body.append($modal);

			$modal.on('click', __.action('close'), () => {
				modal.close();
			});
			modal.open();

			PubSub.publish(`${PROJECT}.common.util.showViaReveal`);
		}
		/**/


		/**
		//-- Cookie options
		static cookieOptions(days) {
			return { expires:days, path:'/', domain:`.${location.hostname}` };
		}
		/**/


		/** lodash: chunk, flatten, maxBy
		//-- Equalizer
		static equalizer(options) {
			const $elementList = $(options.wrapper);

			if ($elementList.length) {
				$elementList.each(function() {
					const $this = $(this);
					const $items = $this.find(options.item);

					if ($items.length > 1) {
						$items.attr('data-equalizer-watch', '');

						// Process breakpoints
						if (options.rows) {
							let max = 'small';
							Foundation.MediaQuery.queries.forEach((size) => {
								if (options.rows[size.name]) {
									max = size.name;
								} else {
									options.rows[size.name] = options.rows[max];
								}
							});
						}

						const $equalizer = new Foundation.Equalizer($this);
						$this.on('resizeme.zf.trigger', () => {
							$equalizer.getHeightsByRow((heights) => {
								let data = heights;

								// Process custom rows
								if (options.rows) {
									data.forEach((arr) => { arr.pop(); });
									data = _.chunk(_.flatten(data), options.rows[Foundation.MediaQuery.current]);
									data.forEach((arr) => { arr.push(_.maxBy(arr, 1)[1]); });
								}

								$equalizer.applyHeightByRow(data);
							});

						}).trigger('resizeme.zf.trigger');
					}
				});
			}
		}
		/**/

	};

})();

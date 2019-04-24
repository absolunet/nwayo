//-------------------------------------
//-- Common - Util
//-------------------------------------

(() => {
	'use strict';

	//-- Public class
	class Util {

		/**
		//-- Show html via reveal
		showViaReveal(id, content) {
			const $modal = $(app.tmpl.commonRevealHtml.render({ id, content }));
			const modal = new Foundation.Reveal($modal);
			__.$body.append($modal);

			$modal.on('click', __.action('close'), () => {
				modal.close();
			});
			modal.open();

			pinki.message.publish(`${PROJECT}.common.util.showViaReveal`);
		}
		/**/


		/**
		//-- Cookie options
		cookieOptions(days) {
			return { expires: days, path: '/', domain: `.${location.hostname}` };
		}
		/**/


		/** lodash: chunk, flatten, maxBy
		//-- Equalizer
		equalizer(options) {
			const $elementList = $(options.wrapper);

			if ($elementList.length !== 0) {
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
									data.forEach((list) => { list.pop(); });
									data = _.chunk(_.flatten(data), options.rows[Foundation.MediaQuery.current]);
									data.forEach((list) => { list.push(_.maxBy(list, 1)[1]); });
								}

								$equalizer.applyHeightByRow(data);
							});

						}).trigger('resizeme.zf.trigger');
					}
				});
			}

		/**/
	}

	app.util = new Util();

})();

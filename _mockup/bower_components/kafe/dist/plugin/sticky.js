(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'plugin.sticky', version:'0.1.0', obj:(function(){

	var
		$window   = $(global),
		$document = $(document)
	;



	/**
	* ### Version 0.1.0
	* Sticky box
	*
	* @module kafe.plugin
	* @class kafe.plugin.sticky
	*/
	var sticky = {};


	/**
	* Initialize sticky (has to be `position:absolute` with defined `top` `left|right` by default).
	*
	* @method init
	* @param {Object} options Additional options.
	*	@param {String|jQueryObject|DOMElement} options.selector Element to stick.
	*	@param {String} [options.align='left'] Specify `right` if your horizontal absolute positioning uses right instead of left.
	*	@param {Boolean} [options.contains=false] If true, the sticky will become scrollable when it reaches the bottom edge of its container.
	*	@param {String|jQueryObject|DOMElement} [options.container=PARENT] Container in which to constrain the sticky.
	*
	* @example
	*	kafe.plugin.sticky.init({ selector: '#post-it' })
	* @example
	*	$('#post-it').kafeSticky('init', {})
	*/
	sticky.init = function(options) {
		options = options || {};

		var $e = $(options.selector);

		// if lone object
		if ($e.length == 1) {

			var
				// options
				align      = (options.align == 'right') ? 'right' : 'left',
				contain    = !!options.contain,
				$container = (!!options.container) ? $(options.container) : $e.parent(),

				// original position
				topOffset     = null,
				originalTop   = parseInt($e.css('top').toString().substr(0, $e.css('top').length-2),10),
				originalHori  = $e.css(align),
				topMargin     = originalTop,
				sticking      = true,
				fromBottom    = false,
				initiate      = true,

				_updateOffset = function () {
					topOffset = $container.offset().top + topMargin;
				}
			;

			_updateOffset();

			$window

				// on scroll & resize
				//---------------------------
				.on('scroll resize',function(event) {

					_updateOffset();

					// current position
					var
						position      = $window.scrollTop(),
						tippingTop    = topOffset - topMargin,
						tippingBottom = tippingTop + ($container.outerHeight() - $e.outerHeight() - (originalTop*2)),
						attr          = {}
					;

					// onresize
					if (event.type == 'resize' && fromBottom) {
						$e.css('top', $container.outerHeight() - $e.outerHeight() - originalTop);
					}

					// initiate the first time
					//---------------------------
					if (initiate) {
						sticking = !(position >= tippingTop && position <= tippingBottom);
						initiate = false;
					}

					// if is about to stick
					//---------------------------
					if (position >= tippingTop && (!contain || position <= tippingBottom)) {

						// calculate offset left
						var attrT = { position: 'absolute' };
						attrT[align] = originalHori;
						$e.css(attrT);
						var offsetLeft = $e.offset().left;

						// stick it
						attr = {
							position: 'fixed',
							top:  topMargin
						};

						// evaluate horizontal position
						if (align == 'left') {
							attr.left = Math.ceil(offsetLeft);
						} else {
							attr.right = Math.ceil($window.width()) - (Math.ceil(offsetLeft) + Math.ceil($e.outerWidth()));
						}

						// apply
						$e.css(attr);
						$container.addClass('kafesticky-sticking');
						sticking = true;
						fromBottom = false;


					// if is about to unstick from top
					//---------------------------
					} else if (position < tippingTop) {

						// unstick it
						attr = {
							position: 'absolute',
							top:      originalTop+'px'
						};
						attr[align] = originalHori;

						// apply
						$e.css(attr);
						$container.removeClass('kafesticky-sticking');
						sticking   = false;
						fromBottom = false;


					// if is about to unstick from end of container
					//---------------------------
					} else if (contain && position >= tippingBottom) {

						// unstick it
						attr = {
							position: 'absolute',
							top:      ($container.outerHeight() - $e.outerHeight() - originalTop)+'px'
						};
						attr[align] = originalHori;

						// apply
						$e.css(attr);
						$container.removeClass('kafesticky-sticking');
						sticking   = false;
						fromBottom = true;
					}

				})

				// initiate
				.trigger('scroll')
			;
		}
	};


	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Sticky', {
		init: function(obj, parameters) {
			sticky.init($.extend({}, parameters[0], {selector:obj}));
		}
	});

	return sticky;

})()}); })(typeof window !== 'undefined' ? window : this);
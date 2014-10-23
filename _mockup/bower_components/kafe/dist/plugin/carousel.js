(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'plugin.carousel', version:'1.0.2', obj:(function(){

	var
		// refresh active/inactive controls, and statuses
		refresh = function(self) {
			var
				__ = self.__,
				none = function(e) { e.preventDefault(); }
			;

			if (!__.wrap) {

				// précédent
				if (__.curr === 0) {
					__.$start
						.addClass('kafecarousel-inactive')
						.off('click', __.startClick)
						.on('click',  none)
					;
					__.$previous
						.addClass('kafecarousel-inactive')
						.off('click', __.previousClick)
						.on('click',  none)
					;
				} else {
					__.$start
						.removeClass('kafecarousel-inactive')
						.off('click', __.startClick)
						.on('click',  __.startClick)
					;
					__.$previous
						.removeClass('kafecarousel-inactive')
						.off('click', __.previousClick)
						.on('click',  __.previousClick)
					;
				}

				// next
				if (__.curr == (__.total-1)) {
					__.$next
						.addClass('kafecarousel-inactive')
						.off('click', __.nextClick)
						.on('click',  none)
					;
					__.$end
						.addClass('kafecarousel-inactive')
						.off('click', __.endClick)
						.on('click',  none)
					;
				} else {
					__.$next
						.removeClass('kafecarousel-inactive')
						.off('click', __.nextClick)
						.on('click',  __.nextClick)
					;
					__.$end
						.removeClass('kafecarousel-inactive')
						.off('click', __.endClick)
						.on('click',  __.endClick)
					;
				}
			}


			// position
			__.$position.html(__.curr+1);

			// status
			__.$status.html('');
			__.$statusNum.html('');
			for (var i=0; i<__.total; ++i) {
				if (i == __.curr) {
					__.$status.append('<span class="kafecarousel-highlight">'+__.statusBullet+'</span>');
					__.$statusNum.append('<span class="kafecarousel-highlight">'+(i+1)+'</span>');
				} else {
					if(!!__.statusLink) {
						__.$status.append(
							$('<a>')
								.attr('href','#')
								.attr('data-kafecarousel-target', i+1)
								.on('click',__.itemSimpleClick)
								.html('<span>'+__.statusBullet+'</span>')
						);
						__.$statusNum.append(
							$('<a>')
								.attr('href','#')
								.attr('data-kafecarousel-target', i+1)
								.on('click',__.itemSimpleClick)
								.html('<span>'+(i+1)+'</span>')
						);
					} else {
						__.$status.append(__.statusBullet);
						__.$statusNum.append(i+1);
					}
				}
			}

			// items highlight
			__.$itemsimple.removeClass('kafecarousel-highlight')
				.filter('[data-kafecarousel-target="'+(__.curr+1)+'"]').addClass('kafecarousel-highlight')
			;

			__.$items.each(function() {
				$(this).children().removeClass('kafecarousel-highlight')
					.eq(__.curr).addClass('kafecarousel-highlight')
				;
			});
		},


		// change the slide
		change = function(self, target) {
			var __ = self.__;

			if (!!__.changing) {
				return false;
			}
			if (target == __.curr) {
				return false;
			}
			__.changing = true;
			__.slideStopAuto();

			var callbackData = {
				action: (Number(target) == target) ? 'item' : target,
				source: {
					position: __.curr+1
				},
				target: {}
			};

			var way;

			var postCallback = function() {
				if (!!__.postSwitchCallback) {
					__.postSwitchCallback(callbackData);
				}
			};

			// current li
			var $liCurr = __.$slides.eq(__.curr);

			// prev/next
			if (target == 'prev' || target == 'next') {

				way = (target == 'prev') ? -1 : 1;

				__.curr =
					(__.wrap) ?
						(__.curr === 0 && way == -1) ?
							(__.total-1)
							: ((__.curr + way) % __.total)
						: (__.curr + way)
				;

			// item
			} else {
				target = Number(target);

				way = (target < __.curr) ? -1 : 1;
				__.curr = target;
			}

			// new li
			var $liNew = __.$slides.eq(__.curr);


			// add callback data
			callbackData.source.obj      = $liCurr.get(0);
			callbackData.target.position = __.curr+1;
			callbackData.target.obj      = $liNew.get(0);

			if (!!__.preSwitchCallback) {
				__.preSwitchCallback(callbackData);
			}



			// transitions
			switch (__.transition) {

				// fade
				case 'fade':
					$liCurr.css('z-index',1);

					$liNew
						.css('z-index',2)
						.fadeIn(__.speed, function(){
							$liCurr.hide();
							__.changing = false;
							postCallback();
						})
					;
				break;


				// move right-bottom > top-left
				/*
				case 'slideTopLeft': 
					var height = __.$container.height() + 'px';
					var width = __.$container.width() + 'px';

					$liCurr.animate({
						top:  (way == 1) ? '-'+height : height,
						left: (way == 1) ? '-'+width  : width
					});

					$liNew
						.css('top',  (way == 1) ? height : '-'+height)
						.css('left', (way == 1) ? width  : '-'+width)
						.animate({
							top:  '0px',
							left: '0px'
						}, postCallback)
					;
				break;
				*/

				// slide horizontal
				case 'slideUp':
				case 'slideDown':
					way = (__.transition == 'slideDown') ? -way : way;

					var height = __.$container.height() + 'px';

					$liCurr.animate(
						{ top: (way == 1) ? '-'+height : height},
						__.speed,
						function() { $(this).hide(); __.changing = false; }
					);

					$liNew
						.css({
							top:     (way == 1) ? height : '-'+height,
							display: 'block'
						})
						.animate({
							top: '0px'
						}, __.speed, postCallback)
					;
				break;

				// slide vertical
				//case 'slideLeft':
				//case 'slideRight':
				default:
					way = (__.transition == 'slideRight') ? -way : way;

					var width = __.$container.width() + 'px';

					$liCurr.animate(
						{ left: (way == 1) ? '-'+width : width },
						__.speed,
						function() { $(this).hide(); __.changing = false; }
					);

					$liNew
						.css({
							left:     (way == 1) ? width : '-'+width,
							display: 'block'
						})
						.animate({
							left: '0px'
						}, __.speed, postCallback)
					;
				break;
			}

			refresh(self);
			// TODO wrap:false autostart bug
			__.slideStartAuto();
		}
	;




	/**
	* ### Version 1.0.2
	* Carousel, image scroller, ticker, whatever you wanna call it...
	*
	* @module kafe.plugin
	* @class kafe.plugin.carousel
	*/
	var carousel = kafe.fn.createInstantiableObject();

	/**
	* Attach behaviors to the carousel structure.
	*
	* @method __constructor
	* @param {Object} options Initial configurations
	*	@param {Object} options.selector The carousel elements
	*		@param {String|jQueryObject|DOMElement} options.selector.container The carousel container.
	*		@param {String|jQueryObject|DOMElement} [options.selector.slides] The carousel slides.
	*		@param {String|jQueryObject|DOMElement} [options.selector.start] Clickable elements that will switch the carousel to the first slide.
	*		@param {String|jQueryObject|DOMElement} [options.selector.prev] Clickable elements that will switch the carousel to the previous slide.
	*		@param {String|jQueryObject|DOMElement} [options.selector.next] Clickable elements that will switch the carousel to the next slide.
	*		@param {String|jQueryObject|DOMElement} [options.selector.end] Clickable elements that will switch the carousel to the last slide.
	*		@param {String|jQueryObject|DOMElement} [options.selector.items] Clickable parent container of elements that will switch the carousel to a specific slide, assumes the children are in slide order.
	*		@param {String|jQueryObject|DOMElement} [options.selector.item] Clickable elements that will switch the carousel to a specific slide via the `data-kafecarousel-target` attribute.
	*		@param {String|jQueryObject|DOMElement} [options.selector.play] Clickable elements that will switch the carousel to autoplay.
	*		@param {String|jQueryObject|DOMElement} [options.selector.pause] Clickable elements that will stop the autoplay of the carousel.
	*		@param {String|jQueryObject|DOMElement} [options.selector.position] Elements that will contain the current position.
	*		@param {String|jQueryObject|DOMElement} [options.selector.total] Elements that will contain the total number of slides.
	*		@param {String|jQueryObject|DOMElement} [options.selector.status] Elements that will contain a list of bullets indicating the status of the carousel.
	*		@param {String|jQueryObject|DOMElement} [options.selector.statusNum] Elements that will contain a list of numbers indicating the status of the carousel.
	*	@param {Boolean} [options.wrap=true] If true, will loop back to the first slide upon reaching the last one. The same is enabled in reverse.
	*	@param {String} [options.transition='slideLeft'] Animation used during a transition. Possible values are `slideLeft`, `slideRight`, `slideUp`, `slideDown` and `fade`.
	*	@param {Number} [options.speed=500] Duration (in milliseconds) of the transition.
	*	@param {Number} [options.startId=1] Index of the starting slide, starting at 1.
	*	@param {Object} [options.autostart] Allows slides to change without a user interaction after a chosen delay.
	*		@param {Number} [options.autostart.interval=3000] Delay (in milliseconds) before starting a transition to the next slide. The transition duration is included in the delay. As an example, an `interval` of 3000 combined with a `speed` of 500 will hold a slide still for 2500 milliseconds before starting the transition.
	*	@param {Function} [options.preSwitchCallback] Trigged upon receiving an instruction to change the current slide but before starting the transition. The following object is passed as a first argument:
	*		@param {Object} options.preSwitchCallback.data An object containing information relative to the transition in progress.
	*			@param {String} options.preSwitchCallback.data.action Current action being performed. Possible values are `prev`, `next` or `item` when using a specific index.
	*			@param {Object} options.preSwitchCallback.data.source Information about the slide being changed.
	*				@param {Number} options.preSwitchCallback.data.source.position Index of the source slide.
	*				@param {DOMElement} options.preSwitchCallback.data.source.obj Reference to the source slide.
	*			@param {Object} options.preSwitchCallback.data.target Information about the destination slide.
	*				@param {Number} options.preSwitchCallback.data.target.position Index of the target slide.
	*				@param {DOMElement} options.preSwitchCallback.data.target.obj Reference to the target slide.
	*	@param {Function} [options.postSwitchCallback] Trigged upon receiving an instruction to change the current slide but before starting the transition. Passes the same argument object as the `preSwitchCallback`.
	*	@param {Boolean} [options.statusLink=false] If true, will generate navigation links in elements linked to the carousel via `data-kafecarousel-id` and the `data-kafecarousel-action="status"` attribute.
	*	@param {String} [options.statusBullet='&bull;'] Text used as the content of generated link in a `statusLink` navigation.
	*	@param {Boolean} [options.pauseOnHover=true] If true, autoswitch will be paused while the mouse hovers a slide.
	*
	* @example
	*	// Sample carousel structure
	*	<section class="home-carousel">
	*		<ul class="home-slides">
	*			<li><a href="#"><img src="/images/slide-01.jpg" /></a></li>
	*			<li><a href="#"><img src="/images/slide-01.jpg" /></a></li>
	*			<li><a href="#"><img src="/images/slide-01.jpg" /></a></li>
	*		</ul>
	*		<span class="home-prev">Back</span>
	*		<span class="home-next">Next</span>
	*		<div class="home-status"></div>
	*	</section>
	*	
	* @example
	*	// Attach behaviors using...
	*	var myCarousel = kafe.plugin.carousel({ selector: { container: '.home-slides' } });
	* @example
	*	// Carousels can be remotely interacted with using custom data attributes...
	*	var myCarousel = kafe.plugin.carousel({ selector: { container: '.home-slides' } });
	* @example
	*	// The jQuery alternative...
	*	$('.home-slides').kafeCarousel('init', {});
	*/
	carousel.prototype.__constructor = function(options) {
		var self = this, __ = self.__;

		// elements
		__.$container  = $(options.selector.container).data('kafecarousel-self', self);
		__.$slides     = (options.selector.slides) ? $(options.selector.slides) : __.$container.children();
		__.$start      = $(options.selector.start);
		__.$previous   = $(options.selector.prev);
		__.$next       = $(options.selector.next);
		__.$end        = $(options.selector.end);
		__.$items      = $(options.selector.items);
		__.$itemsimple = $(options.selector.item);
		__.$play       = $(options.selector.play);
		__.$pause      = $(options.selector.pause);
		__.$position   = $(options.selector.position);
		__.$total      = $(options.selector.total);
		__.$status     = $(options.selector.status);
		__.$statusNum  = $(options.selector.statusNum);

		__.wrap         = (options.wrap === false)  ? false                   : true;
		__.transition   = (options.transition)      ? options.transition      : 'slideLeft';
		__.speed        = (Number(options.speed))   ? Number(options.speed)   : 500;
		__.startId      = (Number(options.startId)) ? Number(options.startId) : 1;
		__.autointerval = (
			(options.autostart) ? (
				(Number(options.autostart.interval)) ?
					Number(options.autostart.interval)
					: 3000)
				: undefined
		);
		__.preSwitchCallback    = (typeof(options.preSwitchCallback)    == 'function') ? options.preSwitchCallback    : undefined;
		__.postSwitchCallback   = (typeof(options.postSwitchCallback)   == 'function') ? options.postSwitchCallback   : undefined;
		__.initCompleteCallback = (typeof(options.initCompleteCallback) == 'function') ? options.initCompleteCallback : undefined;
		__.statusLink           = !!options.statusLink;
		__.statusBullet         = (options.statusBullet) ? options.statusBullet : '&bull';
		__.pauseOnHover         = (options.pauseOnHover === false) ? false : true;


		// cache
		__.$slidesFirst = __.$slides.eq(0);
		__.total        = __.$slides.length;


		// désactiver tout si un seul item
		if (__.total == 1) {
			__.$previous.addClass('kafecarousel-none');
			__.$next.addClass('kafecarousel-none');
			__.$items.addClass('kafecarousel-none');
			__.$itemsimple.addClass('kafecarousel-none');
			__.$position.addClass('kafecarousel-none');
			__.$total.addClass('kafecarousel-none');
			__.$status.addClass('kafecarousel-none');
			__.$statusNum.addClass('kafecarousel-none');

		// sinon préparer carousel
		} else {

			// initial
			__.curr     = __.startId-1;
			__.changing = false;

			// general events				
			__.startClick = function(e) {
				e.preventDefault();
				change(self, 0);
			};

			__.previousClick = function(e) {
				e.preventDefault();
				change(self, 'prev');
			};

			__.nextClick = function(e) {
				e.preventDefault();
				change(self, 'next');
			};

			__.endClick = function(e) {
				e.preventDefault();
				change(self, __.total-1);
			};

			__.itemSimpleClick = function(e) {
				e.preventDefault();
				change(self, $(this).data('kafecarousel-target') - 1);
			};

			__.playClick = function(e) {
				e.preventDefault();
				__.AutoRunning = true;
				__.slideStartAuto();
			};

			__.pauseClick = function(e) {
				e.preventDefault();
				__.AutoRunning = false;
				__.slideStopAuto();
			};

			__.slideStartAuto = function() {
				if (__.AutoRunning) {
					__.Timeout = setTimeout(function(){ change(self, 'next', true); }, __.autointerval);
				}
			};

			__.slideStopAuto = function() {
				clearTimeout(__.Timeout);
				__.Timeout = undefined;
			};




			// on events
			__.$start.on('click',__.startClick);
			__.$previous.on('click',__.previousClick);
			__.$next.on('click',__.nextClick);
			__.$end.on('click',__.endClick);
			__.$itemsimple.on('click',__.itemSimpleClick);

			__.$items.each(function() {
				$(this).children().each(function(i) {
					$(this).on('click',function(e){
						e.preventDefault();
						change(self, i);
					});
				});
			});

			__.$play.on('click',__.playClick);
			__.$pause.on('click',__.pauseClick);

			if (__.pauseOnHover) {
				__.$slides.on({
					mouseenter: __.slideStopAuto,
					mouseleave: __.slideStartAuto
				});
			}





			// intialiser look
			__.$total.html(__.total);
			refresh(self);

			__.$slides.hide()
				.eq(__.startId-1).show()
			;

			switch (__.transition) {
				// fade
				case 'fade':
				break;


				// move vertical
				case 'slideUp':
				case 'slideDown':
					__.$slides.css({
						left: '0px'
					});
					__.$slidesFirst.css('top','0px');
				break;

				// move horizontal
				//case 'slideLeft':
				//case 'slideRight':
				default:
					__.$slides.css({
						top: '0px'
					});
					__.$slidesFirst.css('left','0px');
				break;
			}


			// autostart	
			if (__.autointerval !== undefined) {
				__.AutoRunning = true;
				__.slideStartAuto();
			}
		}

		// Init. Completed callback
		if (!!__.initCompleteCallback) {
			__.initCompleteCallback(self);
		}
	};


	/**
	* Manually call a slide change
	*
	* @method change
	* @param {String|Number} target Action or 1-based slide position
	*
	* @example
	*	// Go to next slide
	*	myCarousel.change('next');
	* @example
	*	// Go to first slide 
	*	myCarousel.change(1);
	* @example
	*	// The jQuery alternative...
	*	$('#home-slides').kafeCarousel('change', 1);
	*/
	carousel.prototype.change = function(target) {
		var self = this, __ = self.__;
		return change(self, (Number(target) == target) ? target-1 : target);
	};



	// Add as jQuery plugin
	kafe.fn.plugIntojQuery('Carousel', {
		init: function(obj, parameters) {
			carousel($.extend(true, {}, parameters[0], {selector:{container:obj}}));
		},
		change: function(obj, parameters) {
			$(obj).data('kafecarousel-self').change(parameters[0]);
		}
	});

	return carousel;

})()}); })(typeof window !== 'undefined' ? window : this);
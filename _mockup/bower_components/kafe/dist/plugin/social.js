(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'plugin.social', version:'0.2.0', obj:(function(){

	var
		getAbsoluteUrl = function(href) {
			if (href) {
				var link = document.createElement('a');
				link.href = href;
				return (link.protocol+'//'+link.host+link.pathname+link.search+link.hash);
			}
			return '';
		},

		networks = {
			facebook: {
				url:        'https://www.facebook.com/sharer/sharer.php?u=<%= url %>&lang=<%= lang %>',
				width:      '675',
				height:     '368',
				script:     { 
								url:   '//connect.facebook.net/<%= lang %>/sdk.js#xfbml=1&appId=<%= appid %>&version=v2.0',
								inner: ''
							},
				button:     '<div class="fb-share-button" data-href="<%= url %>" data-layout="<%= counter %>"></div>',
				loaded:     false,
				size:       { default: '' },
				counter:    { none: 'button', horizontal: 'button_count', vertical: 'box_count'},
				locale:     { fr: 'fr_FR', en: 'en_US'},
			},
			twitter: {
				url:        'https://twitter.com/intent/tweet?url=<%= url %>&text=<%= text %>&related=<%= related %>&lang=<%= lang %>',
				width:      '550',
				height:     '450',
				script:     { 
								url:   'https://platform.twitter.com/widgets.js',
								inner: ''
							},
				button:     '<a href="<%= url %>" class="twitter-share-button" data-related="<%= related %>" data-lang="<%= lang %>" data-size="<%= size %>" data-count="<%= counter %>"></a>',
				loaded:     false,
				size:       { default: '', small: 'medium', large: 'large'},
				counter:    { none: 'none', horizontal: 'horizontal', vertical: 'vertical'},
				locale:     { fr: 'fr', en: 'en'},
			},
			linkedin: {
				url:        'https://www.linkedin.com/shareArticle?url=<%= url %>&summary=<%= text %>&mini=true&lang=<%= lang %>',  // &ro=false &title=lorem &source=example.com
				width:      '600',
				height:     '500',
				script:     { 
								url:   '//platform.linkedin.com/in.js',
								inner: 'lang: <%= lang %>'
							},
				button:     '<script type="IN/Share" data-url="<%= url %>" data-counter="<%= counter %>"></script>',
				loaded:     false,
				size:       { default: '' },
				counter:    { none: '', horizontal: 'right', vertical: 'top'},
				locale:     { fr: 'fr_FR', en: 'en_US'},
			},
			googleplus: {
				url:        'https://plus.google.com/share?url=<%= url %>&t=<%= text %>&lang=<%= lang %>',
				width:      '520',
				height:     '520',
				script:     { 
								url:   'https://apis.google.com/js/platform.js',
								inner: '{lang: \'<%= lang %>\'}'
							},  
				button:     '<div class="g-plus" data-action="share" data-href="<%= url %>" data-annotation="<%= counter %>" data-height="<% if(counter == "vertical-bubble") { %>60<% } else { %><%= size %><% } %>"></div>',
				loaded:     false,
				size:       { default: '', small: '15', large: '24' },
				counter:    { none: 'none', horizontal: 'bubble', vertical: 'vertical-bubble'},
				locale:     { fr: 'fr-CA', en: 'en-US'},
			},
			pinterest: {
				url:        'http://<%= lang %>.pinterest.com/pin/create/button/?url=<%= url %>&description=<%= text %>&media=<%= media %>',
				width:      '750',
				height:     '335',
				script:     { 
								url:   '//assets.pinterest.com/js/pinit.js',
								inner: ''
							},        
				button:     '<a href="//<%= lang %>.pinterest.com/pin/create/button/?url=<%= url %>&media=<%= media %>&description=<%= text %>" data-pin-do="buttonPin" data-pin-config="<%= counter %>" data-pin-height="<%= size %>"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_gray_<%= size %>.png" /></a>',
				loaded:     false,
				size:       { default: '20', small: '20', large: '28' },
				counter:    { none: 'none', horizontal: 'beside', vertical: 'above'},
				locale:     { fr: 'fr', en: 'en'},
			}
		},


		share_options = {
			lang:    kafe.env('lang'), 
			url:     document.location,
			text:    document.title,
			related: '', // twitter : https://dev.twitter.com/docs/tweet-button#related
			media:   getAbsoluteUrl( $('head link[rel="image_src"]').attr('href') ) // pinterest media
		},

		genuine_options = {
			lang:    kafe.env('lang'), 
			url:     document.location,
			text:    document.title,
			related: '', // twitter : https://dev.twitter.com/docs/tweet-button#related
			size:    'default', 
			counter: 'horizontal',
			media:   getAbsoluteUrl( $('head link[rel="image_src"]').attr('href') ) // pinterest media
		}
	;


	/**
	* ### Version 0.2.0
	* Social tools
	*
	* @module kafe.plugin
	* @class kafe.plugin.social
	*/
	var social = {};


	/**
	* Initialize share buttons functionality
	*
	* @method initShareButtons
	* @param {Object} [options] Options
	*	@param {Object} [options.lang] Display popup sharing language. Not fully supported by all social networks. Possible values are `en`, `fr` or by default is `kafe.env('lang')`.
	*	@param {Object} [options.url] Specific url sharing. By default is the current url.
	*	@param {Object} [options.text] Specific text sharing. By default is the browser title.
	*	@param {Object} [options.media] Image url for Pinterest sharing. By default is the link to the tag `image_src` in the head of the document.
	*
	* @example
	*	<span data-kafesocial-action="share" data-kafesocial-network="facebook">Facebook</span>
	*	<span data-kafesocial-action="share" data-kafesocial-network="twitter"><Twitter/span>
	*	<span data-kafesocial-action="share" data-kafesocial-network="linkedin">Linkedin</span>
	*	<span data-kafesocial-action="share" data-kafesocial-network="googleplus">Google+</span>
	*	<span data-kafesocial-action="share" data-kafesocial-network="pinterest" data-kafesocial-options='{ "url":"http://www.flickr.com/photos/kentbrew/6851755809/", "media":"http://farm8.staticflickr.com/7027/6851755809_df5b2051c9_z.jpg" }'>Pinterest</span>
	*	<script>
	*		$(function() {
	*			kafe.plugin.social.initShareButtons();
	*		});
	*	</script>
	*
	*/
	social.initShareButtons = function(options) {
		share_options = $.extend({}, share_options, options || {});

		$('[data-kafesocial-action="share"]').on('click', function() {
			var $this = $(this);
			var network = $this.data('kafesocial-network');
			var options = $.extend({}, share_options, $this.data('kafesocial-options') || {});
			var data = networks[network];
			//set the good language format
			options.lang = networks[network].locale[options.lang];
			if (data.url) {
				window.open( _.template(data.url)(options) , '_blank', 'width='+data.width+',height='+data.height+',menubar=no,toolbar=no');
			}
		});
	};

	/**
	* Initialize genuine buttons functionality
	*
	* @method initGenuineButtons
	* @param {Object} [options] Options
	*	@param {Object} [options.lang] Display button language. Possible values are `en`, `fr` or by default is `kafe.env('lang')`.
	*	@param {Object} [options.url] Specific url sharing. By default is the current url.
	*	@param {Object} [options.text] Specific text sharing. By default is the browser title.
	*	@param {Object} [options.size] Display button size. Possible values are `small` and `large`. Only work with Twitter, Google + and Pinterest.
	*	@param {Object} [options.counter] Orientation and visibility of counter. Possible values are `none`, `horizontal` and `vertical`. By default is `horizontal`.
	*	@param {Object} [options.media] Image url for Pinterest sharing. By default is the link to the tag `image_src` in the head of the document.
	*
	* @example
	*	<span data-kafesocial-action="genuine" data-kafesocial-network="facebook" data-kafesocial-options='{ "appid":"1514943792075126" }'></span>
	*	<span data-kafesocial-action="genuine" data-kafesocial-network="twitter"></span>
	*	<span data-kafesocial-action="genuine" data-kafesocial-network="linkedin"></span>
	*	<span data-kafesocial-action="genuine" data-kafesocial-network="googleplus"></span>
	*	<span data-kafesocial-action="genuine" data-kafesocial-network="pinterest" data-kafesocial-options='{ "url":"http://www.flickr.com/photos/kentbrew/6851755809/", "media":"http://farm8.staticflickr.com/7027/6851755809_df5b2051c9_z.jpg" }'></span>
	*	<script>
	*		$(function() {
	*			kafe.plugin.social.initGenuineButtons();
	*		});
	*	</script>
	*
	*/

	// Dev Documentation :
	// https://developers.google.com/+/web/share/
	// https://dev.twitter.com/docs/tweet-button
	// https://developers.facebook.com/docs/plugins/like-button
	// http://business.pinterest.com/en/widget-builder#do_pin_it_button
	// https://developer.linkedin.com/plugins/share-plugin-generator

	social.initGenuineButtons = function(options) {
		genuine_options = $.extend({}, genuine_options, options || {});

		$('[data-kafesocial-action="genuine"]').each(function() {

			var 
				$this = $(this),
				insertScript = function(url, inner) {
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.async = true;
					script.src = url;
					script.innerHTML = inner;
					var all = document.getElementsByTagName('script')[0];
					all.parentNode.insertBefore(script, all);
				},
				network = $this.data('kafesocial-network'),
				options = $.extend({}, genuine_options, $this.data('kafesocial-options') || {}),
				data = networks[network]
			;
			//set the good language format
			options.lang = networks[network].locale[options.lang];
			//button counter layout
			options.counter = networks[network].counter[options.counter];
			//button size
			options.size = ( networks[network].size ? networks[network].size[options.size] : options.size );

			if (!data.loaded) {
				networks[network].loaded = true;
				$this.html(_.template(data.button)(options));
				insertScript(_.template(data.script.url)(options), _.template(data.script.inner)(options));
			}
			
		});
	};

	return social;

})()}); })(typeof window !== 'undefined' ? window : this);
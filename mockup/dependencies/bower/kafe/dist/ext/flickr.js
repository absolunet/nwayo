(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.flickr', version:'1.1', obj:(function(){

	var
		// default params
		_params = {
			api_key:        '',
			media:          'photos',
			privacy_filter: 1,
			sort:           'date-posted-desc',
			page:           1,
			per_page:       10,
			extras:         ['url_sq', 'url_q', 'url_t', 'url_s', 'url_n', 'url_m', 'url_z', 'url_c', 'url_l', 'url_o', 'description', 'date_upload', 'date_taken', 'path_alias']
		},

		// return merged params
		_mergeParams = function(options, defaults) {
			options = options || {};

			if (options.extras) {
				options.extras = options.extras.concat(defaults.extras);
			}

			return $.extend({}, defaults, options);
		},


		// return call data
		_call = function(method, fields, options, callback) {
			var
				p = _mergeParams(options, _params),
				data = {}
			;

			p.extras = p.extras.join(',');

			// add manual options to fields
			for (var o in options) {
				if ($.inArray(o, fields) == -1) {
					fields = fields.concat(o);
				}
			}

			// trim fields
			for (var i in fields) {
				data[fields[i]] = p[fields[i]];
			}
			data.method = 'flickr.' + method;
			data.format = 'json';

			// call
			$.ajax({
				url: 'https://api.flickr.com/services/rest/',
				data: data,
				jsonp: 'jsoncallback',
				dataType: 'jsonp',
				success: callback
			});
		},


		// return images sizes
		_processPhotos = function(photos) {
			for (var i in photos) {
				var
					photo = photos[i],
					s     = ['sq', 'q', 't', 's', 'n', 'm', 'z', 'c', 'l', 'o'],
					e     = new RegExp('^([0-9]{4})\\-([0-9]{2})\\-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$', 'gi').exec(photo.datetaken)
				;

				// url
				photo.url = '//www.flickr.com/photos/' + photo.pathalias + '/' + photo.id + '/';
				photo.description = photo.description._content;

				// sizes
				photo.sizes = _getSizes(photo);

				for (var j in s) {
					delete photo['url_' + s[j]];
					delete photo['width_' + s[j]];
					delete photo['height_' + s[j]];
				}

				// timestamp
				photo.datetaken = new Date(e[1], e[2] - 1, e[3], e[4], e[5], e[6], 0);
				photo.dateupload = new Date(photo.dateupload * 1000);
			}

			return photos;
		},


		// parse photosets data
		_processPhotosets = function(photosets) {
			for (var i in photosets) {
				var photoset = photosets[i];

				photoset.title = photoset.title._content;
				photoset.description = photoset.description._content;

				// timestamp
				photoset.date_create = new Date(photoset.date_create * 1000);
				photoset.date_update = new Date(photoset.date_update * 1000);
			}

			return photosets;
		},


		// return images sizes
		_getSizes = function(photo) {
			var
				large = data(
					(photo.url_l) ? 'l' :
					(photo.url_o) ? 'o' :
					(photo.url_c) ? 'c' :
					(photo.url_z) ? 'z' : 'm'
				),
				original = (photo.url_o) ? data('o') : large,

				data = function (s) {
					return {
						url: photo['url_' + s],
						width: parseInt(photo['width_' + s],10),
						height: parseInt(photo['height_' + s],10)
					};
				}
			;

			return {
				thumb_square: data('sq'),                            //   75x75
				large_square: data('q'),                             // 150x150
				thumb: data('t'),                                    //     100
				small: (photo.url_s) ? data('s') : original,         //     240
				small2: (photo.url_n) ? data('n') : original,        //     320
				medium: (photo.url_m) ? data('m') : original,        //     500
				medium2: (photo.url_z) ? data('z') : original,       //     640
				medium3: (photo.url_c) ? data('c') : large,          //     800
				large: large,                                        //    1024
				original: original
			};
		},


		// return optimized photo size from flickr
		_getOptimizedSize = function(photo, options) {
			var
				maxPhotoW     = options.maxWidth  ? options.maxWidth  : null,
				maxPhotoH     = options.maxHeight ? options.maxHeight : null,
				asBgImg       = options.asBgImg   ? options.asBgImg   : false,
				doResize      = options.doResize  ? options.doResize  : false,
				optimizedSize = photo.sizes.original
			;

			if (maxPhotoW || maxPhotoH) {
				for (var i in photo.sizes) {
					var currSize = photo.sizes[i];
					if (asBgImg) {

						if ((currSize.width > maxPhotoW && currSize.height > maxPhotoH) && (optimizedSize.width > currSize.width || optimizedSize.height > currSize.height)) {
							optimizedSize = currSize;
						}

					} else {

						if (maxPhotoW && maxPhotoH) {
							if ((currSize.width > maxPhotoW || currSize.height > maxPhotoH) && (optimizedSize.width > currSize.width || optimizedSize.height > currSize.height)) {
								optimizedSize = currSize;
							}
						} else if (maxPhotoW) {
							if (currSize.width > maxPhotoW && optimizedSize.width > currSize.width) {
								optimizedSize = currSize;
							}
						} else if (maxPhotoH) {
							if (currSize.height > maxPhotoH && optimizedSize.height > currSize.height) {
								optimizedSize = currSize;
							}
						}
					}
				}
			}

			if (doResize) {
				var newDim = _getResizedDimensions(optimizedSize.width, optimizedSize.height, { maxWidth: maxPhotoW, maxHeight: maxPhotoH, asBgImg: asBgImg });
				optimizedSize.width = newDim.width;
				optimizedSize.height = newDim.height;
			}

			photo.optSize = optimizedSize;
			return photo;
		},


		// return the resized dimensions of the photo, keeps ratio
		_getResizedDimensions = function(baseWidth, baseHeight, options) {
			var
				newWidth  = baseWidth         ? baseWidth         : 0,
				newHeight = baseHeight        ? baseHeight        : 0,
				maxWidth  = options.maxWidth  ? options.maxWidth  : null,
				maxHeight = options.maxHeight ? options.maxHeight : null,
				asBgImg   = options.asBgImg   ? options.asBgImg   : false,

				setNewWidth = function() {
					var nPhotoW = parseInt((maxHeight * newWidth) / newHeight,10);
					newHeight = maxHeight;
					newWidth = nPhotoW;
				},

				setNewHeight = function () {
					var nPhotoH = parseInt((maxWidth * newHeight) / newWidth,10);
					newWidth = maxWidth;
					newHeight = nPhotoH;
				}
			;

			if (asBgImg) {
				if (maxHeight && newWidth < newHeight && newWidth > maxWidth) {
					setNewHeight();
					if (newHeight < maxHeight) { setNewWidth(); }
				} else if (maxWidth && newHeight < newWidth && newHeight > maxHeight) {
					setNewWidth();
					if (newWidth < maxWidth) { setNewHeight(); }
				}
			} else {
				if (maxWidth && newWidth > maxWidth) {
					setNewHeight();
				}
				if (maxHeight && newHeight > maxHeight) {
					setNewWidth();
				}
			}

			return { width: newWidth, height: newHeight };
		}
	;


	/**
	* ### Version 1.1
	* Extra methods for the Flickr API.
	*
	* @module kafe.ext
	* @class kafe.ext.flickr
	*/
	var flickr = {

		/**
		* Public photos
		*
		* @property PRIVACY_PUBLIC 
		* @type Number
		**/
		PRIVACY_PUBLIC: 1,

		/**
		* Private photos visible to friends
		*
		* @property PRIVACY_FRIENDS 
		* @type Number
		**/
		PRIVACY_FRIENDS: 2,

		/**
		* Private photos visible to family
		*
		* @property PRIVACY_FAMILY 
		* @type Number
		**/
		PRIVACY_FAMILY: 3,

		/**
		* Private photos visible to friends & family
		*
		* @property PRIVACY_FRIENDS_FAMILY 
		* @type Number
		**/
		PRIVACY_FRIENDS_FAMILY: 4,

		/**
		* Completely private photos
		*
		* @property PRIVACY_PRIVATE 
		* @type Number
		**/
		PRIVACY_PRIVATE: 5
	};


	/**
	* Set default Flickr params.
	*
	* @method setParams
	* @param {Object} options Options
	*	@param {String} options.api_key API key
	*	@param {Boolean} [options.media='photos'] Media type. Possible values are `all`, `photos`, `videos`
	*	@param {Boolean} [options.privacy_filter=PRIVACY_PUBLIC] Privacy supported. Possible values are `flickr.PRIVACY_*`
	*	@param {Boolean} [options.sort='date-posted-desc'] Sort order. Possible values are `date-posted-asc`, `date-posted-desc`, `date-taken-asc`, `date-taken-desc`, `interestingness-desc`, `interestingness-asc`, `relevance`
	*	@param {String} [options.page=1] Page number start
	*	@param {Function} [options.per_page=10] Number of element per page
	*	@param {Array(String)} [options.extras=BASIC_FIELDS] Extra fields to fetch. More on the [Flickr API](http://www.flickr.com/services/api/)
	*/
	flickr.setParams = function () {
		_params = _mergeParams(arguments[0], _params);
	};


	/**
	* Get photosets for specific user.
	*
	* @method getPhotosets
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	* @return {Object} A Flickr API photo collection
	*/
	flickr.getPhotosets = function (options, callback) {
		return api.photosets_getList(options, callback);
	};


	/**
	* Get a photoset cover.
	*
	* @method getPhotosetCover
	* @param {Object} photoset Photoset
	*	@param {Object} photoset.id Photoset id
	*	@param {Object} photoset.primary Primary photo id
	* @param {Function} callback Callback
	* @return {Object} A Flickr API photo object
	*/
	flickr.getPhotosetCover = function (photoset, callback) {
		api.photosets_getPhotos({ photoset_id: photoset.id }, function (data) {
			var cover = data.photo[0];
			$.each(data.photo, function (i, photo) {
				if (photo.id == photoset.primary) {
					cover = photo;
					return false;
				}
			});
			callback(cover);
		});
	};


	/**
	* Get photos.
	*
	* @method getPhotos
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	* @return {Object} A Flickr API photo collection
	*/
	flickr.getPhotos = function (options, callback) {
		return api.photosets_getPhotos(options, callback);
	};


	/**
	* Get photostream.
	*
	* @method getPhotostream
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	* @return {Object} A Flickr API photo collection
	*/
	flickr.getPhotostream = function (options, callback) {
		return api.photos_search(options, callback);
	};


	/**
	* Get optimized size (optSize) for a photo.
	*
	* @method getOptimizedSize
	* @param {Object} photo Photo object from Flickr API
	* @param {Object} [options] Options
	*	@param {Number} [options.maxWidth] Maximum width
	*	@param {Number} [options.maxHeight] Maximum height
	*	@param {Boolean} [options.doResize=false] Resize to fit
	*	@param {Boolean} [options.asBgImg=false] Is it to be used as a background style
	* @return {Object} A Flickr API photo object
	*/
	flickr.getOptimizedSize = function (photo, options) {
		return _getOptimizedSize(photo, options);
	};


	/**
	* Get a optimized <img> tag for a photo
	*
	* @method getImgElement
	* @param {Object} photo Photo object from Flickr API
	* @param {Object} [options] Options
	*	@param {Number} [options.maxWidth] Maximum width
	*	@param {Number} [options.maxHeight] Maximum height
	*	@param {Boolean} [options.centered=false] Center image
	*	@param {Object} [options.link] Link HTML attributes
	* @param {Object} [attributes] HTML attributes to apply to &lt;img&gt; tag
	* @return {String} HTML markup for image
	*/
	flickr.getImgElement = function (photo, options, attributes) {
		options    = options    || {};
		attributes = attributes || {};
		
		var
			maxPhotoW = options.maxWidth                           ? options.maxWidth  : null,
			maxPhotoH = options.maxHeight                          ? options.maxHeight : null,
			centered  = options.centered && maxPhotoW && maxPhotoH ? options.centered  : true,
			link      = options.link                               ? options.link      : null
		;

		photo = _getOptimizedSize(photo, { maxWidth: maxPhotoW, maxHeight: maxPhotoH, doResize: true });

		// add attributes
		var
			strAttr = '',
			attrAlt = photo.title
		;
		for (var attr in attributes) {
			if (attr != 'width' && attr != 'height' && attr != 'src') {
				if (attr == 'alt') {
					attrAlt = attributes[attr];
				} else {
					strAttr += (' ' + attr + '="' + attributes[attr] + '"');
				}
			}
		}

		var
			imgElement = '<img width="' + photo.optSize.width + '" height="' + photo.optSize.height + '" src="' + photo.optSize.url + '" alt="' + attrAlt + '"' + strAttr + ' />',
			wrapperStyles = ''
		;

		// centered option
		if (centered) {
			var
				hPadding = maxPhotoW ? Math.floor(((maxPhotoW - photo.optSize.width) / 2))  : null,
				vPadding = maxPhotoH ? Math.floor(((maxPhotoH - photo.optSize.height) / 2)) : null
			;
			if (hPadding || vPadding) {
				wrapperStyles += ("padding:" + (vPadding ? vPadding + "px " : "0px ") + (hPadding ? hPadding + "px;" : "0px;"));
			}
		}

		// put link on photo
		if (link) {
			link = link || {};
			var linkAttributes = "";
			for (attr in link) {
				linkAttributes += (' ' + attr + '="' + link[attr] + '"');
			}
			imgElement = '<a' + linkAttributes + '>' + imgElement + '</a>';
		}

		// wrap image if necessary
		if (wrapperStyles !== '') {
			imgElement = '<span style="display:block; ' + wrapperStyles + '">' + imgElement + '</span>';
		}

		return imgElement;
	};


	/**
	* Get a optimized background styles for a photo
	*
	* @method getBgImageStyles
	* @param {Object} photo Photo object from Flickr API
	* @param {Object} [options] Options
	*	@param {Number} [options.maxWidth] Maximum width
	*	@param {Number} [options.maxHeight] Maximum height
	* @return {Object} CSS attributes to apply
	*/
	flickr.getBgImageStyles = function (photo, options) {
		options = options || {};
		
		var
			maxPhotoW = options.maxWidth  ? options.maxWidth  : null,
			maxPhotoH = options.maxHeight ? options.maxHeight : null
		;

		photo = _getOptimizedSize(photo, { maxWidth: maxPhotoW, maxHeight: maxPhotoH, doResize: true, asBgImg: true });
		return { backgroundImage: ("url(" + photo.optSize.url + ")"), backgroundSize: (photo.optSize.width + "px " + photo.optSize.height + "px"), backgroundRepeat: "no-repeat", backgroundPosition: "center" };
	};




	var api = {};


	/**
	* Get the photosets (direct call to API method flickr.photosets.getList)
	*
	* @method api.photosets_getList
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	*/
	api.photosets_getList = function (options, callback) {
		_call(
			'photosets.getList',
			['api_key', 'user_id'],
			options,
			function (data) {
				data.photosets.photoset = _processPhotosets(data.photosets.photoset);
				callback(data.photosets);
			}
		);
	};


	/**
	* Get the list of photos in a set (direct call to API method flickr.photosets.getPhotos)
	*
	* @method api.photosets_getPhotos
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	*/
	api.photosets_getPhotos = function (options, callback) {
		_call(
			'photosets.getPhotos',
			['api_key', 'photoset_id', 'extras', 'privacy_filter', 'per_page', 'page', 'media'],
			options,
			function (data) {
				data.photoset.photo = _processPhotos(data.photoset.photo);
				callback(data.photoset);
			}
		);
	};


	/**
	* Search photos (direct call to API method flickr.photos.search)
	*
	* @method api.photos_search
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	*/
	api.photos_search = function (options, callback) {
		_call(
			'photos.search',
			['api_key', 'user_id', 'per_page', 'page', 'extras'],
			options,
			function (data) {
				data.photos.photo = _processPhotos(data.photos.photo);
				callback(data.photos);
			}
		);
	};


	flickr.api = api;

	return flickr;

})()}); })(typeof window !== 'undefined' ? window : this);
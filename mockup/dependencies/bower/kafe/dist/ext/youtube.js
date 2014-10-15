//= require 'dependencies/bower/kafe/dist/url'

(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.youtube', version:'1.1', obj:(function(){

	var
		// default params
		_params = {
			maxResults: 10,
			startIndex: 1,
			orderBy:    'relevance',
			q:          '',
			author:     '',
			category:   ''
		},

		// return query string
		_queryString = function(data) {
			var q = '';
			for (var i in data) {
				q += i+'='+data[i].toString()+'&amp;';
			}
			return q.toString().substr(0,q.length-5);
		},

		// parses search results into clean and simple result objects.
		_simpleSearchResults = function(results) {
			
			var simpleResults = [];
			if (results !== undefined) {
				$.each(results, function(i, val) {
					
					var entry = {};

					entry.id = (val.id.$t).toString().split('/').pop();
					entry.title = val.title.$t;
					entry.author = val.author[0].name.$t;
					entry.publishedDate = new Date(val.published.$t);
					
					entry.thumbnail = {};
					entry.thumbnail.large = val.media$group.media$thumbnail[0].url;
					entry.thumbnail.small = val.media$group.media$thumbnail[1].url;
						
					entry.categories = [];
					$.each(val.category, function(ci, cval) {
						if (ci > 0)
							entry.categories.push(cval.term);
					});
					
					simpleResults.push(entry);
					
				});
			}
				
			return simpleResults;
		}
	;


	/**
	* ### Version 1.1
	* Extra methods for Youtube.
	*
	* @module kafe.ext
	* @class kafe.ext.youtube
	*/
	var youtube = {};
	

	/**
	* Set default Youtube params.
	*
	* @method setParams
	* @param {Object} options Options
	*	@param {Number} [options.maxResults=10] Number of results
	*	@param {Number} [options.startIndex=1] Start index (page)
	*	@param {String} [options.orderBy='relevance'] Order by choice
	*	@param {String} [options.q] Query string of search
	*	@param {String} [options.author] Author of videos
	*	@param {Array(String)} [options.category] Categories
	*/
	youtube.setParams = function() {
		$.extend(_params, arguments[0]);
	};


	/**
	* Get the default params with optional extra params.
	*
	* @method getParams
	* @param {Object} [options] Options
	* @return {Object} The default Youtube params.
	*/
	youtube.getParams = function() {
		return $.extend({}, _params, arguments[0]);
	};


	/**
	* Builds a youtube search url then returns the results as the first argument of the specified callback.
	*
	* @method search
	* @param {Object} [options] Options
	* @param {Function} callback Callback
	*/
	youtube.search = function(options, callback) {
		options = youtube.getParams(options);
		
		var
			path = 'https://gdata.youtube.com/feeds/api/videos?',
			query = 'alt=json-in-script&callback=?' +
					'&max-results=' + options.maxResults +
					'&start-index=' + options.startIndex +
					'&orderby=' + options.orderBy
		;

		if (options.query) {
			query += '&q=' + encodeURIComponent(options.query);
		}
			
		if (options.author) {
			query += '&author=' + encodeURIComponent(options.author);
		}
			
		if (options.category) {
			query += '&category=' + encodeURIComponent(options.category.join('|'));
		}
			
		$.ajax({
			url: path + query,
			dataType: 'json',
			success: function(data, textStatus, jqXHR) {
				var simpleResults = _simpleSearchResults(data.feed.entry);
				callback(simpleResults);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw kafe.error(new Error(errorThrown));
			}
		});
		
	};


	/**
	* Builds a youtube search url then returns the results as the first argument of the specified callback.
	*
	* @method getPlaylistVideos
	* @param {String} playlistId Playlist id
	* @param {Function} callback Callback
	*/
	youtube.getPlaylistVideos = function (playlistId, callback) {

		if (!playlistId) {
			if (callback) callback(null);
			return;
		}

		if (playlistId.toString().substr(0, 2) == 'PL') {
			playlistId = playlistId.toString().substr(2, playlistId.length);
		}
		
		var
			playListURL = '//gdata.youtube.com/feeds/api/playlists/' + playlistId + '?v=2&alt=json&callback=?',
			videoURL = '//www.youtube.com/watch?v=',
			imageURL = '//img.youtube.com/vi/'
		;
		
		$.ajax({
			url: playListURL,
			dataType: 'json',
			success: function (data) {
				var videos = [];
				$.each(data.feed.entry, function (i, item) {
					$.each(item.link, function (y, subitem) {
						if (subitem.rel == 'alternate') {
							var
								qs      = kafe.url.parseSearchParams('?' + subitem.href.toString().split('?')[1]),
								videoId = qs.v,
								video   = {
									title: item.title.$t,
									id: videoId,
									url: videoURL + videoId,
									img_thumb: imageURL + videoId + '/default.jpg',
									img_large: imageURL + videoId + '/hqdefault.jpg'
								}
							;
							videos.push(video);
						}
					});
				});
				callback(videos);
			},
			error: function () {
				callback(null);
			}
		});
	};

	return youtube;

})()}); })(typeof window !== 'undefined' ? window : this);
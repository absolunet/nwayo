(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.soundcloud', version:'0.1.0', obj:(function(){

	var
		// default params
		_params = {
			cliendId: ''
		}
	;
	
	
	/**
	* ### Version 0.1.0
	* Extra methods for the Soundcloud API.
	* Requires `//connect.soundcloud.com/sdk.js` to be included
	*
	* @module kafe.ext
	* @class kafe.ext.soundcloud
	*/
	var soundcloud = {};


	/**
	* Initialize the SoundCloud API.
	*
	* @method init
	* @param {Object} options Options
	*	@param {String} options.cliendId SoundCloud id
	*/
	soundcloud.init = function (options) {
		var p = $.extend({}, _params, (options) ? options : {});

		if (global.SC) {
			SC.initialize({ client_id: p.clientId });
		}
	};


	/**
	* Get playlist tracks.
	*
	* @method getPlaylistTracks
	* @param {String} playlistId The playlist id
	* @param {Object} [options] Options
	* @param {Function} [callback] The callback
	*/
	soundcloud.getPlaylistTracks = function (playlistId, options, callback) {
		options = (!!options) ? options : {};

		if (global.SC) {
			SC.get('/playlists/' + playlistId, options, callback);
		} else {
			callback();
		}
	};


	/**
	* Get all tracks.
	*
	* @method getTracks
	* @param {Object} [options] Options
	* @param {Function} [callback] The callback
	*/
	soundcloud.getTracks = function (options, callback) {
		options = (!!options) ? options : {};

		if (global.SC) {
			SC.get('/tracks/', options, callback);
		} else {
			callback();
		}
	};


	return soundcloud;

})()}); })(typeof window !== 'undefined' ? window : this);
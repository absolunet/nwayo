(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.facebook', version:'1.4.0', obj:(function(){

	var
		// dictionary
		_locale = {
			fr: 'fr_FR',
			en: 'en_US'
		},

		// default params
		_params = {
			app_id:             '',
			status:             true,
			cookie:             true,
			xfbml:              true,
			statusConnected:    null,
			statusNotConnected: null,
			permissions:        ''
		},
		_userSession = null,
		_userDetails = null,
		_userLikes   = null,

		_getUserDetails = function (callback) {
			$.ajax({
				url:      'https://graph.facebook.com/' + _userSession.userID,
				dataType: 'json',
				data:     'accessToken=' + _userSession.accessToken + '&callback=?',
				success:  function(data, textStatus, jqXHR) {
					_userDetails = data;
					if (callback) {
						callback(data);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					throw kafe.error(new Error(errorThrown));
					//Return public details instead?...
				}
			});
		},

		_handleResponse = function (response) {
			if (response.status == 'connected' && !!_params.init.statusConnected) {
				_userSession = response.authResponse;
				_getUserDetails(function(user) {
					_params.init.statusConnected(user);
				});

			} else if (!!_params.init.statusNotConnected) {
				_userSession = null;
				_params.init.statusNotConnected();
			}
		}
	;

	// init Fb SDK
	$(function(){
		if (!$('#fb-root').length) {
			$('body').append('<div id="fb-root"></div>');
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.async = true;
				js.src = '//connect.facebook.net/' + _locale[kafe.env('lang')] + '/all.js#xfbml=1';
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
	});


	/**
	* ### Version 1.4.0
	* Extra methods for the Facebook API.
	*
	* @module kafe.ext
	* @class kafe.ext.facebook
	*/
	var facebook = {};


	/**
	* Set default facebook params.
	*
	* @method setParams
	* @param {Object} options Options
	*	@param {String} [options.app_id] Application ID
	*	@param {Boolean} [options.status=true] Fetch fresh status
	*	@param {Boolean} [options.cookie=true] Enable cookie support
	*	@param {Boolean} [options.xfbml=true] Parse XFBML tags
	*	@param {String} [options.permissions] Comma separated list of Extended permissions
	*	@param {Function} [options.statusConnected] Callback if user connected
	*	@param {Function} [options.statusNotConnected] Callback if user is not connected
	*/
	facebook.setParams = function() {
		$.extend(_params, arguments[0]);
	};


	/**
	* Get the default params with optional extra params.
	*
	* @method getParams
	* @param {Object} [options] Options
	* @return {Object} The default facebook params.
	*/
	facebook.getParams = function() {
		return $.extend({}, _params, arguments[0]);
	};


	/**
	* Initialize the Facebook API.
	*
	* @method init
	* @param {Object} [options] Options
	*/
	facebook.init = function() {

		var p = facebook.getParams(arguments[0]);

		if (p.app_id) {
			
			global.fbAsyncInit = function() {
				
				// Starts a relation with the Facebook app.
				FB.init({
					appId: p.app_id,
					status: p.status, // check login status
					cookie: p.cookie, // enable cookies to allow the server to access the session
					xfbml: p.xfbml    // parse XFBML
				});
				
				// Listen to status changes to apply layout changes accordingly.
				FB.Event.subscribe('auth.statusChange', _handleResponse);
				
				// Apply immediate layout changes depending of user login status.
				FB.getLoginStatus(_handleResponse);
			};
			
		} else {
			throw kafe.error(new Error('Facebook requires an app_id to be initiated.'));
		}
	};


	/**
	* Open the login dialog.
	*
	* @method login
	* @param {Object} [options] Options
	* @param {Function} [callback] Callback on success
	*/
	facebook.login = function(options,callback) {
		var p = facebook.getParams(options);

		FB.login(function(response) {
			if (response.authResponse) {
				if (callback) {
					callback(response);
				}
			}
		}, {scope: p.permissions});
	};


	/**
	* Logs the user out.
	*
	* @method logout
	* @param {Function} [callback] Callback
	*/
	facebook.logout = function(callback) {
		FB.logout(callback);
	};
	

	/**
	* Get the session.
	*
	* @method getSession
	* @return {Object} Session object or null if not logged
	*/
	facebook.getSession = function() {
		return _userSession;
	};


	/**
	* Get the user details.
	*
	* @method getUser
	* @return {Object} User details or null if not logged
	*/
	facebook.getUser = function() {
		return _userDetails;
	};


	/**
	* Get if user likes an item.
	*
	* @method checkUserLike
	* @param {String} id A likable facebook item id (page, application, etc.)
	* @return {Boolean} If user likes the item
	*/
	facebook.checkUserLike = function(id) {
		$.ajax({
			url:      'https://graph.facebook.com/' + _userSession.userID + '/likes',
			dataType: 'json',
			data:     'accessToken=' + _userSession.accessToken + '&callback=?',
			success:  function(data, textStatus, jqXHR) {
				var _found = false;
				$.each(data.data, function(i, val) {
					if (val.id == id) {
						_found = true;
						return false;
					}
				});
				
				return _found;
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw kafe.error(new Error(errorThrown));
				//Return public details instead?...
			}
		});
	};

	return facebook;

})()}); })(typeof window !== 'undefined' ? window : this);
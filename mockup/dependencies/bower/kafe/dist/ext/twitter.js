(function(global, undefined) { var kafe = global.kafe, $ = kafe.dependencies.jQuery; kafe.bonify({name:'ext.twitter', version:'1.1.1', obj:(function(){

	/**
	* ### Version 1.1.1
	* Extra methods for Twitter.
	*
	* @module kafe.ext
	* @class kafe.ext.twitter
	*/
	var twitter = {};
	


	/**
	* Loads the api javascript used for twitter widgets
	*
	* @method loadWidgetAPI
	*/
	twitter.loadWidgetAPI = function() {
		(function(d,s,id){
			var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
			if(!d.getElementById(id)){
				js=d.createElement(s);
				js.id=id;
				js.src=p+'://platform.twitter.com/widgets.js';
				fjs.parentNode.insertBefore(js,fjs);
			}
		})(document,'script','twitter-wjs');
	};


	/**
	* Outputs tweet with links.
	*
	* @method linkifyTweet
	* @param {String} tweet Plain text tweet
	* @param {Object} [options] Options
	*	@param {String} [options.link] Normal link template
	*	@param {String} [options.user] User link template
	*	@param {String} [options.hash] Hash link template
	* @return {String} The tweet with links
	*
	* @example
	*	kafe.ext.twitter.linkifyTweet('I really dig this #twitter function by @absolunet : http://www.absolunet.com/');
	*	// returns "I really dig this #<a href="//search.twitter.com/search?q=%23twitter" data-external="true">twitter</a> function by @<a href="//twitter.com/absolunet" data-external="true">absolunet</a> : <a href="http://www.absolunet.com/" data-external="true">http://www.absolunet.com/</a>"
	*/
	twitter.linkifyTweet = function(tweet,options) {
		options   = (!!options) ? options : {};

		var
			$link = (!!options.link) ? $(options.link) : $('<a data-external="true">'),
			$user = (!!options.user) ? $(options.user) : $('<a data-external="true">'),
			$hash = (!!options.hash) ? $(options.hash) : $('<a data-external="true">'),

			_link = function($tmpl,data,link) {
				return $('<div>').append( $tmpl.clone().attr('href', link+data).text(data) ).html();
			}
		;
		

		tweet = tweet.replace(/[a-z]+:\/\/[a-z0-9-_]+\.[a-z0-9-_:~%&#\?\/.=]+[^:\.,\)\s*$]/ig, function (link) {
			return _link($link,link,'');
		});
		tweet = tweet.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15})/g, function (blank, prev, user) {
			return prev + '@' + _link($user,user,'//twitter.com/');
		});
		tweet = tweet.replace(/(^|[^\w'"]+)\#([a-zA-Z0-9_]+)/g, function (blank, prev, hash) {
			return prev + '#' + _link($hash,hash,'//search.twitter.com/search?q=%23');
		});
		
		return tweet;
	};


	return twitter;

})()}); })(typeof window !== 'undefined' ? window : this);
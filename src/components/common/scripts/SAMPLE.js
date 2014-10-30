//-------------------------------------
//-- SAMPLE
//-------------------------------------

//= **require     components/foo/scripts/bar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(function(){
	'use strict';

	var local = {};

	//-- Foo
	local.initFoo = function() {
		if (app.env.isFoo) {

		}
	};

	//-- Bar
	local.initBar = function() {
		if ($('.bar').length) {

		}
	};


	$(function() {
		local.initFoo();
		local.initBar();
	});

})();

//-------------------------------------
//-- SAMPLE
//-------------------------------------

//= **require     components/foo/scripts/bar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(function ʩfileCommonSAMPLE(){
	'use strict';

	var local = {};

	//-- Foo
	local.initFoo = function() {
		if (app.env.isFoo) {
			this.foo = 'bar';
		}
	};

	//-- Bar
	local.initBar = function() {
		if ($('.bar').length) {
			this.bar = 'foo';
		}
	};


	$(function() {
		local.initFoo();
		local.initBar();
	});

})();

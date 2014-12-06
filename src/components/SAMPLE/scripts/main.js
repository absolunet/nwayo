//-------------------------------------
//-- SAMPLE
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/foo/scripts/bar
//= **jshtml      components/foo/templates/foobar
//= **jshtml_tree components/foo/templates

(function ʩfileSAMPLEMain(){
	'use strict';

	var local = {};

	//-- Foo
	local.foo = function() {

	};

	//-- Bar
	local.bar = function() {

	};



	//-- Public
	app.foo = {};

	app.foo.bar1 = '';

	app.foo.bar2 = function() {

	};


	$(function() {
		local.foo();
		local.bar();
	});

})();

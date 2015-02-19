//-------------------------------------
//-- Form
//-------------------------------------

//= **require     bower_components/foo/bar
//= **require     components/common/scripts/foobar
//= **jshtml      components/common/templates/foobar
//= **jshtml_tree components/common/templates

(function(){
	'use strict';

	var local = {};


	//-- Cache data
	local.cache = function() {

		//

	};


	//-- Bind events
	local.bind = function() {

		// input mask
		/**
		$('input[data-mask]').each(function() {
			var
				$this = $(this),
				mask  = $this.data('mask')
			;

			switch (mask) {
				case 'phone':       $this.inputmask('(999) 999-9999'); break;
				case 'phone-ext':   $this.inputmask('(999) 999-9999 [ext: 99999]'); break;
				case 'date':        $this.inputmask('yyyy-mm-dd'); break;
				case 'time':        $this.inputmask('hh:mm:ss'); break;
				case 'postalcode':  $this.inputmask('A9A 9A9'); break;
				case 'numeric':     $this.inputmask('non-negative-decimal', {radixPoint:',', digits:2 }); break;
				case 'numeric-int': $this.inputmask('9', {repeat:6, greedy:false }); break;
				default:            $this.inputmask(mask); break;
			}
		});
		/**/

	};


	//-- To execute on start
	local.start = function() {

		//

	};


	$(function() {
		local.cache();
		local.bind();
		local.start();
	});

})();

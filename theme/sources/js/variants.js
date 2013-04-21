/*------------------------------------------------------------------------------------//
// Client : MySite
//------------------------------------------------------------------------------------*/

//>>excludeStart('excludeRequire', pragmas.excludeRequire);
require([
	'js/core'
]);
//>>excludeEnd('excludeRequire');

(function(kafe, App, undefined){

	var 
		$         = kafe.dependencies.jQuery,
		_         = kafe.dependencies.underscore,
		Modernizr = kafe.dependencies.Modernizr,
		Local     = {}
	;
		
	/*- Home -------------------------------------------------------------------*/
	Local.InitHome = function() {
		if (App.env.isHome) {

		}
	};

	/*- Lateral Column -------------------------------------------------------------------*/
	Local.InitLateralcolumn = function() {
		if (App.dom.lateralCol) {

		}
	};
	

	$(function(){ 
		Local.InitHome();
		Local.InitLateralcolumn();
	});
	
})(window.kafe, window.MySite);

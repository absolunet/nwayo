/*------------------------------------------------------------------------------------//
// Client : -
//------------------------------------------------------------------------------------*/

window.MONSITE = (function($,K,undefined){
	
	var 
		$window   = $(window),
		$document = $(document),
		$body     = $('body'),
		kEnv      = K.env,
		culture   = kEnv('culture'),
		lang      = kEnv('lang')
	;

	function _fonctionLocale() {
		
	}
	
	
	// ------------------------------------------
	// PUBLIC
	// ------------------------------------------
	var MS = {};
	
	MS.variablePublique = 'bonjour monsieur';
	
	MS.fonctionPublique = function() {
		
	};
	


	// ------------------------------------------
	// INIT
	// ------------------------------------------
	$(function(){
	
		// à exécuter quand le document est ready
		
	});
	
	
	
	return MS;
})(jQuery,kafe);
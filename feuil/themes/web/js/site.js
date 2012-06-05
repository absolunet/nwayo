/*------------------------------------------------------------------------------------//
// Client : -
//------------------------------------------------------------------------------------*/

window.MONSITE = (function($,K,undefined){
	
	var 
		$window   = $(window),
		$document = $(document),
		kEnv      = K.env,
		culture   = kEnv('culture'),
		lang      = kEnv('lang'),
		page      = kEnv('page'),
		tmpl      = kEnv('tmpl')
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
	
		var $body = $('body');

		// à exécuter quand le document est ready
		
	});
	
	
	
	return MS;
})(jQuery,kafe);
//-------------------------------------
//-- Docs - Base
//-------------------------------------

(() => {
	'use strict';

	FastClick.attach(document.body);

	const adjectives = [
		'❤︎',
		'hard work',
		'heated debates',
		'cold sweats',
		'bad puns',
		'coffee & tea'
	];

	document.querySelector('[data-component="adjective"]').innerHTML = adjectives[Math.floor(Math.random() * adjectives.length)];
})();

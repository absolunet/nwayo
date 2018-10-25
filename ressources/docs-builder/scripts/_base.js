//-------------------------------------
//-- Docs - Base
//-------------------------------------

(() => {
	'use strict';

	const adjectives = [
		'❤︎',
		'hard work',
		'heated debates',
		'cold sweats',
		'bad puns',
		'coffee & tea'
	];

	document.querySelector('[data-component="adjective"]').innerHTML = adjectives[Math.floor(Math.random() * adjectives.length)];

	document.querySelectorAll('a[rel="external"]').forEach((link) => {
		link.target = '_blank';
	});
})();

//--------------------------------------------------------
//-- Manager
//--------------------------------------------------------
'use strict';

const { manager } = require('@absolunet/manager');

manager.init({
	repositoryType: 'single-package',

	dist: {
		node: true,
		include: [
			'**/*.html',
			'**/*.stub',
			'**/*.yaml'
		]
	}
});

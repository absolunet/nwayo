//-------------------------------------
//-- CLI
//-------------------------------------
'use strict';

module.exports = ({ root }) => {
	process.title = 'nwayo';

	const cli = require(`${__dirname}/tasks`); // eslint-disable-line global-require

	cli.argv(process.argv.slice(2), root);
};

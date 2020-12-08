'use strict';

const fss = require('@absolunet/fss');


module.exports = ({ sass }) => {
	return {
		'file-exists($file)'(fileParameter) {
			const filePath = this.absolutePath(fileParameter).getValue();

			return sass.types.Boolean[fss.exists(filePath).toString().toUpperCase()];
		}
	};
};

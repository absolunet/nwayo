'use strict';


module.exports = ({ nwayoApi, sass }) => {
	return {
		'path-from-source($path)'(pathParameter) {
			const pathValue  = pathParameter.getValue();
			const parameters = pathValue.startsWith(`~`) ? ['node_modules', pathValue.replace('~', '')] : [pathValue];

			return new sass.types.String(nwayoApi.absolutePath(nwayoApi.pathFromSource(...parameters)));
		}
	};
};

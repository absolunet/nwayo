'use strict';


module.exports = ({ nwayoApi, file, sass }) => {
	return {
		'absolute-path($path)'(pathParameter) {
			const pathValue = pathParameter.getValue();

			if (pathValue.startsWith('~')) {
				return this.pathFromSource(new sass.types.String(nwayoApi.formatPath(pathValue)));
			}

			return new sass.types.String(nwayoApi.formatPath(nwayoApi.dirname(file), pathValue));
		}
	};
};

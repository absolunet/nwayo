'use strict';

const ROOT       = '../force-app/main/default';
const COMPONENTS = `./components`;
const STATIC     = `./staticresources/nwayo-builds`;

const nwayo = require('../../../@nwayo/api');


nwayo
	.destination(ROOT)
//	.copyDirectory('../../components/common/assets/fonts', `${ROOT}/${STATIC}/fonts`)
	.sass('styles/site.scss', `${STATIC}/styles`)
	.sass('styles/cHeader.scss', COMPONENTS)
	.sass('styles/cFooter.scss', COMPONENTS)
;

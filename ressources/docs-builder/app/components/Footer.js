//-------------------------------------
//-- Footer
//-------------------------------------

import React from 'react';

import env   from '../helpers/env';
import paths from '../helpers/paths';


class Footer extends React.PureComponent {

	render() {
		return (

			<footer>
				<a href={`${paths.github}/blob/master/license`} rel="external">MIT</a>
				&copy; 2011-
				{env.year}

				<span className="made">
					Made with
					<span className="adjective">{env.adjective}</span>
					by
					<a href="https://absolunet.com" rel="external">Absolunet</a>
				</span>
			</footer>

		);
	}

}


export default Footer;

//-------------------------------------
//-- Header
//-------------------------------------

import React    from 'react';
import { Link } from 'react-router-dom';

import { version } from '../helpers/generated';
import paths       from '../helpers/paths';


class Header extends React.Component {

	render() {
		return (

			<header>
				<p className="nwayo"><Link to="/"><img src={`${paths.root}/static/images/nwayo.svg`} className="logo" alt="nwayo" /> nwayo</Link> <span className="version">{version}</span></p>
				<a href={paths.github} className="github" rel="external">View on GitHub</a>
			</header>

		);
	}

}


export default Header;

//-------------------------------------
//-- Nav
//-------------------------------------

import React       from 'react';
import { NavLink } from 'react-router-dom';

import { tree } from '../helpers/generated';


class Nav extends React.PureComponent {

	render() {

		const items = [];
		Object.keys(tree).forEach((level1Id) => {
			if (!level1Id.startsWith('__')) {
				const level1 = tree[level1Id];

				let children;
				if (level1.children) {

					const subItems = [];
					Object.keys(level1.children).forEach((level2Id) => {
						const level2 = level1.children[level2Id];

						subItems.push((
							<li key={level2Id}>
								<NavLink to={`/${level1Id}/${level2Id}/`} activeClassName="active">{level2.title}</NavLink>
							</li>
						));
					});

					children = (
						<ul>{subItems}</ul>
					);
				}

				items.push((
					<li key={level1Id}>
						<NavLink to={`/${level1Id}/`} activeClassName="active">{level1.title}</NavLink>
						{children}
					</li>
				));
			}
		});

		return (
			<nav>
				<ul>
					{items}
				</ul>
			</nav>
		);
	}

}


export default Nav;

//-------------------------------------
//-- App
//-------------------------------------

import React                    from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { hot }                  from 'react-hot-loader';

import paths from './helpers/paths';

import Header  from './components/Header';
import Nav     from './components/Nav';
import Content from './components/Content';
import Footer  from './components/Footer';


class App extends React.PureComponent {

	render() {
		return (
			<BrowserRouter basename={paths.root}>
				<Route
					path=":path(.*)"
					render={({ match }) => {
						return (
							<>
								<Header />

								<div className="container">
									<Nav />
									<Content path={match.params.path} />
								</div>

								<Footer />
							</>
						);
					}}
				/>
			</BrowserRouter>
		);
	}

}


export default hot(module)(App);

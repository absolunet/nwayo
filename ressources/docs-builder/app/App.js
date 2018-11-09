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

/* global process, module */
class App extends React.Component {

	render() {
		return (
			<BrowserRouter basename={process.env.PUBLIC_URL || paths.root}>
				<Route path=":path(.*)" render={({ match }) => {
					return (
						<React.Fragment>

							<Header></Header>

							<div className="container">
								<Nav></Nav>
								<Content path={match.params.path}></Content>
							</div>

							<Footer></Footer>

						</React.Fragment>
					);
				}} />
			</BrowserRouter>
		);
	}

}


export default hot(module)(App);

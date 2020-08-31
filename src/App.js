import './wdyr';

import React, { useState, useEffect, useContext } from "react";
import {   
	Switch,
	Route,
	Redirect,
	BrowserRouter,
} from "react-router-dom";
import UserProvider, { UserContext } from 'providers/user-provider';
import SignInContainer from 'containers/sign-in';
import TypePracticeContainer from 'containers/type-practice';


const App = () => {
	return (
		<UserProvider>
			<AuthApp />
		</UserProvider>
	);
};

const AuthApp = () => {
	const user = useContext(UserContext);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		if (user) {
			setIsAuthenticated(true);
		}
	}, [user, isAuthenticated]);

	return (
		<UserProvider>
			<BrowserRouter>
				<Switch>
					<LoginRoute
						path="/login"
						component={SignInContainer}
						appProps={{ isAuthenticated }}
					/>
					<TypePracticeRoute
						path="/type-practice"
						component={TypePracticeContainer}
						appProps={{ isAuthenticated }}
					/>
					<Redirect to="/login" />
				</Switch>
			</BrowserRouter>
		</UserProvider>
	);
};

export const TypePracticeRoute = ({ component: C, appProps, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props =>
				appProps.isAuthenticated
					? <C {...props} {...appProps} />
					: null}
		/>
	);
};

export const LoginRoute = ({ component: C, appProps, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props =>
				!appProps.isAuthenticated
					? <C {...props} {...appProps} />
					: <Redirect to="/type-practice" />}
		/>
	);
};

export default App;
import './wdyr';

import React from "react";
import {   
	BrowserRouter as Router,
	Switch,
	Route,
	Link 
} from "react-router-dom";
import SignInContainer from 'containers/sign-in';
import TypePractice from 'views/type-practice';

const App = () => {
	return (
		/* <SignInContainer /> */
		<TypePractice />
	);
};

export default App;
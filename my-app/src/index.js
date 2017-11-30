import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { BrowserRouter, Route } from 'react-router-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import './assets/css/App.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import Homepage from './components/Homepage.js';
import Individualsport from './components/Individualsport.js';
import Userdetails from './components/Userdetails.js';
import Admin from './components/Admin.js';
import Adminlogin from './components/Adminlogin.js';
import Adminhome from './components/Adminhome.js';


ReactDOM.render(
	<Provider>
	    <Router history={ browserHistory }>
		  <div>
		  	<Route exact path = "/" component={ Homepage } />
			<Route path = "/login" component={ App } />
			<Route path = "/home" component={ Homepage } />
			<Route path = "/join_in_sport/:sportId" component={ Individualsport } />
			<Route path = "/userdetails/:userId" component={ Userdetails } />
			<Route path = "/admin-requests/:userId/:sportId" component={ Admin } />
			<Route path = "/adminlogin/:userId/:sportId" component={ Adminlogin } />
			<Route path = "/adminlogin" component={ Adminlogin } />
			<Route path = "/adminhome" component={ Adminhome } />
	      </div>
		</Router>
	</Provider>
	,document.getElementById('root'));

registerServiceWorker();

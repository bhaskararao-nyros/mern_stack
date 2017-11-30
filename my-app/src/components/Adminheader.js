import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class Adminheader extends Component {

constructor(props) {
  super(props);
  this.state = {
	
  }
}

async componentDidMount() {

}

async logout() {
	localStorage.removeItem('Admin');
	browserHistory.push('/adminlogin');
}

render(){
  return(
  		<nav class="navbar navbar-default">
  		{!localStorage.Admin ? 
  		  <div class="container-fluid">
		    <div class="navbar-header">
		      <a class="navbar-brand" href="#">Sports Comptetion</a>
		    </div>
		  </div> : 
		  <div class="container-fluid">
		    <ul class="nav navbar-nav navbar-right">
		      <li><a href="#">Welcome...Admin</a></li>
		      <li><a href="" onClick={()=> {this.logout()}}>Logout</a></li>
		    </ul>
		  </div>
		}
		</nav>
  	);
}

}
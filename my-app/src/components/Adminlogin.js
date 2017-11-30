import React, { Component } from 'react';
import $ from "jquery";
import './../assets/css/App.css';
import { browserHistory } from 'react-router';
import Adminheader from './Adminheader.js';

export default class Adminlogin extends Component {


constructor(props) {
  super(props);
  this.state = {
	
  }

  this.submitAdminForm = this.submitAdminForm.bind(this);
}

async submitAdminForm(event) {
	event.preventDefault();

	var username = this.refs.username.value;
	var password = this.refs.password.value;
	var userdata = {username, password};
	var flag = 1;

	if (username == '') {
		flag = 0;
		$("#username_err").text("* please enter username");
	}
	if (password == '') {
		flag = 0;
		$("#pass_err").text("* please enter password");
	}

	if (flag == 1) {
		this.refs.form.reset();
			$.ajax({
			type: 'POST',
		    url: 'http://10.90.90.55:3001/admin_login',
		    data: userdata,
		    success:function(data) {
		    	console.log(data);
		    	if (data.status == 'success') {
		    		localStorage.setItem('Admin', 'Admin');
		    		if (localStorage.user_id && localStorage.sport_id) {
		    			let path = `/admin-requests/${localStorage.user_id}/${localStorage.sport_id}`;
		    			browserHistory.push(path);
		    		} else {
		    			browserHistory.push('/adminhome');
		    		}
		    	} else {
		    		$("#form_err").text("Credentials does not match.....Try again");			    				    		
		    	} 
		    },
		    error:function(err) {
		    	console.log("Error");
		    }
		})
	}
}



render(){
	$(document).ready(function() {
		$("#username_err").text('');
		$("#pass_err").text('');

		$("#username").keyup(function() {
			$("#username_err").text('');
			$("#form_err").text("");
		})
		$("#pwd").keyup(function() {
			$("#pass_err").text('');
		})
	});

  return(
  	<div>
  		<Adminheader />
		<div class="container">
			<h2 class="text-center">Admin Login</h2><br />
			<div class="panel panel-default adminpanel">
				<span className="err" id="form_err"></span>
				 <form onSubmit={this.submitAdminForm} ref="form">
				  <div class="form-group">
				    <label for="username">Username:</label>
				    <input type="text" ref="username" class="form-control admininput" id="username" />
				    <span id="username_err" className="err"></span>
				  </div>
				  <div class="form-group">
				    <label for="pwd">Password:</label>
				    <input type="password" ref="password" class="form-control admininput" id="pwd" />
				    <span id="pass_err" className="err"></span>
				  </div>
				  <button type="submit" class="btn btn-default">Submit</button>
				</form> 
			</div>
		</div>
  	</div>
  	);
}


}
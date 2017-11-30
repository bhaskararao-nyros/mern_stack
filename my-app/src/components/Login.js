import React, { Component } from 'react';
import $ from "jquery";
import { browserHistory } from 'react-router';
import './../assets/css/App.css';

export default class Login extends Component {
	constructor(props) {
		super(props);
		

		this.submitLoginForm = this.submitLoginForm.bind(this);
	}

	componentDidMount() {
		if (localStorage.userId) {
			browserHistory.push('/');
		}
	}

	submitLoginForm(event) {
		event.preventDefault();
		var name = this.refs.name.value;
		var password = this.refs.password.value;
		var userdata = {name, password};

		var flag = 1;
		if (name == '') {
			flag = 0;
			$("#name_err").text("* please enter username");
		}
		if (name != '' && name.length < 3) {
			flag = 0;
			$("#name_err").text("* min 3 characters");
		}
		if (password == '') {
			flag = 0;
			$("#pass_err").text("* please enter password");
		}

		if (flag == 1) {
			this.refs.form.reset();
				$.ajax({
				type: 'POST',
			    url: 'http://10.90.90.55:3001/login_participant',
			    data: userdata,
			    success:function(data) {
			    	if (data.status == 'success') {
			    		localStorage.setItem('userId', data.userdetails._id);
			    		localStorage.setItem('userName', data.userdetails.user_name);

			    		browserHistory.push('/home');
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

render() {
$(document).ready(function() {
	$("#name_err").text('');
	$("#pass_err").text('');

	$("#name").keyup(function() {
		$("#name_err").text('');
		$("#form_err").text("");
	})
	$("#password").keyup(function() {
		$("#pass_err").text('');
	})
});

		return( 
			    <div>
			       <h3>Participate Here</h3><br/>
			       <h3><b>Login</b></h3><br />
			       <span className="err" id="form_err"></span>
			       <form onSubmit={this.submitLoginForm} ref="form">
			        <div className="form-group">
			          <label htmlFor="name">Username</label>
			          <input ref="name" type="name" className="form-control" id="name" />
			          <span id="name_err" className="err"></span>
			        </div>
			        <div className="form-group">
			          <label htmlFor="password">Password</label>
			          <input ref="password" type="password" className="form-control" id="password" />
			          <span id="pass_err" className="err"></span>
			        </div>
			        <button type="submit" className="btn btn-primary">Login</button>
			      </form>
			    </div>			
		);
	}
}
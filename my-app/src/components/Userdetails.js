import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import $ from "jquery";
import Header from './Header.js';
import './../assets/css/App.css';

export default class Userdetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user:[],
			edited_user:false,
			selectGender:'MALE',
			name:'',
			email:'',
			age:'',
			password:'',
			cnfpassword:''
		}	

		this.get_user_details = this.get_user_details.bind(this);
		this.submitRegisterForm = this.submitRegisterForm.bind(this);
		this.setGender = this.setGender.bind(this);
		this.setName = this.setName.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.setAge = this.setAge.bind(this);
		this.setPassword = this.setPassword.bind(this);
		this.setCnfPassword = this.setCnfPassword.bind(this);
	}

	async componentDidMount() {
	    if (!localStorage.userId) {
	        browserHistory.push('/login');
	    }

	    await this.get_user_details();
	}

	async get_user_details() {
		var user_id = this.props.params.userId;
		await $.ajax({
	      type: 'POST',
	      url: 'http://10.90.90.55:3001/get_user_details',
	      dataType:'json',
	      data:{ user_id:user_id },
	      success:function(response) {
		   	if (response.status == 'success') {
				this.setState({user:response.userdetails,
				name:response.userdetails.user_name,
				email:response.userdetails.email,
				age:response.userdetails.age,
				password:response.userdetails.password,
				cnfpassword:response.userdetails.password
				});
			}   
		  }.bind(this)
	   });
	}

	async edit_user() {
		this.setState({edited_user:true});
	}

	async setGender(event) {
	  this.setState({ 
	    selectGender:event.target.value
	  })
	}

	async setName(event) {
		this.setState({ 
		    name:event.target.value
		})
	}
	async setEmail(event) {
		this.setState({ 
		    email:event.target.value
		})
	}
	async setAge(event) {
		this.setState({ 
		    age:event.target.value
		})
	}
	async setPassword(event) {
		this.setState({ 
		    password:event.target.value
		})
	}

	async setCnfPassword(event) {
		this.setState({ 
		    cnfpassword:event.target.value
		})
	}

	async submitRegisterForm(event) {
	  event.preventDefault();
	  var user_id = this.props.params.userId;
	  var name = this.refs.name.value;
	  var email = this.refs.email.value;
	  var age = this.refs.age.value;
	  var password = this.refs.password.value;
	  var cnfpass = this.refs.cnfpass.value;
	  var gender = this.state.selectGender;
	  var data = {name,age,password,gender,user_id};
  
	  var flag = 1;

	  if (name == '') {
	      flag = 0;
	      $("#name_err").text("* Please enter name");
	  }
	  if (email == '') {
	      flag = 0;
	      $("#email_err").text("* Please enter email");
	  }
	  if (password == '') {
	      flag = 0;
	      $("#pass_err").text("* Please enter password");
	  }
	  if (name != '' && name.length < 3) {
	      flag = 0;
	      $("#name_err").text("* Min 3 characters");
	  }
	  if (age == '') {
	      flag = 0;
	      $("#age_err").text("* Please enter your age");
	  }
	  if (password != cnfpass) {
	      flag = 0;
	      $("#cnfpass_err").text("* Both passwords must be same");
	  }
	  

	  if (flag == 1) {
	      $.ajax({
	      type: 'POST',
	      url: 'http://10.90.90.55:3001/edit_participant',
	      data: data,
	      dataType:'json',
	      success:function(data) {
	        console.log(data);
	          if (data.status == 'success') {
	          		window.location.reload();
	          		localStorage.setItem('userName', name);
	            
	          } else {
	              $("#form_err").text("Username already exists");
	              $("#name").focus();
	          } 
	      },
	      error:function(err) {
	        console.log(err);
	      }
	    })
	  }

	}


	render() {

		$(document).ready(function() {
		  $("#name_err").text('');
		  $("#email_err").text('');
		  $("#pass_err").text('');
		  $("#age_err").text('');

		  $("#name").keyup(function() {
		    $("#name_err").text('');
		  })
		  $("#email").keyup(function() {
		    $("#email_err").text('');
		  })
		  $("#password").keyup(function() {
		    $("#pass_err").text('');
		    $("#form_err").text("");
		  })
		  $("#age").keyup(function() {
		    $("#age_err").text('');
		    $("#form_err").text("");
		  })
		  $("#cnfpass").keyup(function() {
		    $("#cnfpass_err").text('');
		  })

	    $(".numonly").keydown(function (e) {
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
	            (e.keyCode >= 35 && e.keyCode <= 40)) {
	            return;
	        }
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }
    });
		});


		return(
			<div>
			    <header>
			       <Header />
			    </header>
			    <div className="container" id="usercontainer">
			      <h3>Your details</h3><hr />
			    	<div className="row">
			    	{this.state.edited_user ? '' :
			    		<div className="col-md-6" id="userlabels">
			    			<h4><b>Name</b></h4>
			    			<h4><b>Email</b></h4>
			    			<h4><b>Age</b></h4>
			    			<h4><b>Gender</b></h4>
			    			<h4><b>Password</b></h4>
			    		</div>
			    	}
			    		<div className="col-md-6">
			    		{this.state.edited_user ? 			    					    				
		    				
			    			<div>
			                 <span id="form_err" className="err"></span>
			                <form onSubmit={this.submitRegisterForm} ref="form">
			                  <div className="form-group">
			                    <label htmlFor="name">Name</label>
			                    <input ref="name" type="name" className="form-control" id="name" 
			                    value={ this.state.name } onChange={this.setName} />
			                    <span id="name_err" className="err"></span>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="email">Email</label>
			                    <input ref="email" type="email" className="form-control" id="email" 
			                    value={ this.state.email } onChange={this.setEmail} />
			                    <span id="email_err" className="err"></span>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="age">Age</label>
			                    <input ref="age" type="text" className="form-control numonly" id="age" 
			                    value={ this.state.age } onChange={this.setAge} />
			                    <span id="age_err" className="err"></span>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="gender">Gender</label><br />
			                    { this.state.user.gender === 'MALE' ?
			                      <div onChange={this.setGender.bind(this)}>
			                        <input type="radio" value="MALE" name="gender" defaultChecked={true}/> Male
			                        <input type="radio" value="FEMALE" name="gender"/> Female
			                      </div> :
			                      <div onChange={this.setGender.bind(this)}>
			                        <input type="radio" value="MALE" name="gender" /> Male
			                        <input type="radio" value="FEMALE" name="gender" defaultChecked={true}/> Female
			                      </div>
			                  	}
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="password">Password</label>
			                    <input ref="password" type="text" className="form-control" id="password" 
			                    value={ this.state.password } onChange={this.setPassword} />
			                    <span id="pass_err" className="err"></span>
			                  </div>
			                  <div className="form-group">
			                    <label htmlFor="cnfpass">Confirm Password</label>
			                    <input ref="cnfpass" type="password" className="form-control" id="cnfpass" 
			                    value={ this.state.cnfpassword } onChange={this.setCnfPassword}/>
			                    <span id="cnfpass_err" className="err"></span>
			                  </div>
			                  <button type="submit" className="btn btn-primary">Save</button>
			                </form>
			              </div>
			              :
			                <div>
			    				<h4>{ this.state.user.user_name }</h4>
			    				<h4>{ this.state.user.email }</h4>
			    				<h4>{ this.state.user.age }</h4>
			    				<h4>{ this.state.user.gender }</h4>
			    				<h4>{ this.state.user.password }</h4>
			    			</div>
			              }			    						    			
			    		</div>
			    	</div>
			    	{!this.state.edited_user ?
			    		<button className="btn btn-primary btn-sm" type="submit" onClick={()=> {this.edit_user()}}>Edit</button>
			    		: '' }
			    </div>
			</div>
			);
	}
}


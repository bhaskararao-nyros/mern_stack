import React, { Component } from 'react';
import $ from "jquery";
import { browserHistory } from 'react-router';

export default class Register extends Component {
  constructor(props) {
    super(props);
      this.state = {
    selectGender:'MALE',
  }

this.submitRegisterForm = this.submitRegisterForm.bind(this);
this.setGender = this.setGender.bind(this);
}

submitRegisterForm(event) {
  event.preventDefault();
  var name = this.refs.name.value;
  var email = this.refs.email.value;
  var age = this.refs.age.value;
  var password = this.refs.password.value;
  var cnfpass = this.refs.cnfpass.value;
  var gender = this.state.selectGender;

  var data = {name,email,age,password,gender};
  
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
      url: 'http://10.90.90.55:3001/register_participant',
      data: data,
      dataType:'json',
      success:function(data) {
        console.log(data);
          if (data.status == 'success') {
            localStorage.setItem('userId', data.reguser._id);
            localStorage.setItem('userName', data.reguser.user_name);
            browserHistory.push("/home");
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
setGender(event) {
  this.setState({ 
    selectGender:event.target.value
  })
}

render() {

$(document).ready(function() {
  $("#name_err").text('');
  $("#pass_err").text('');
  $("#age_err").text('');
  $("#email_err").text('');

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
                 <h3><b>Register</b><small> Here to participate</small></h3><br />
                 <span id="form_err" className="err"></span>
                <form onSubmit={this.submitRegisterForm} ref="form">
                  <div className="form-group">
                    <label htmlFor="name">Name/Username</label>
                    <input ref="name" type="name" className="form-control" id="name" />
                    <span id="name_err" className="err"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input ref="email" type="email" className="form-control" id="email" />
                    <span id="email_err" className="err"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input ref="age" type="text" className="form-control numonly" id="age" />
                    <span id="age_err" className="err"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label><br />
                      <div onChange={this.setGender.bind(this)}>
                        <input type="radio" value="MALE" name="gender" defaultChecked={true}/> Male
                        <input type="radio" value="FEMALE" name="gender"/> Female
                      </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input ref="password" type="password" className="form-control" id="password" />
                    <span id="pass_err" className="err"></span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cnfpass">Confirm Password</label>
                    <input ref="cnfpass" type="password" className="form-control" id="cnfpass" />
                    <span id="cnfpass_err" className="err"></span>
                  </div>
                  <button type="submit" className="btn btn-primary">Register</button>
                </form>
              </div> 
        );
    }
}
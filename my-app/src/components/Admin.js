import React, { Component } from 'react';
import $ from "jquery";
import { browserHistory } from 'react-router';
import Workbook from 'react-excel-workbook';
import Adminheader from './Adminheader.js';

export default class Admin extends Component {


constructor(props) {
  super(props);
  this.state = {
	name:'',
	sport:'',
	email:'',
	user:[],
	sports:[]
  }

  this.send_response = this.send_response.bind(this);
}

async componentDidMount() {
	
	if (!localStorage.Admin) {

		localStorage.setItem('user_id', this.props.params.userId);
		localStorage.setItem('sport_id', this.props.params.sportId);

		browserHistory.push('/adminlogin');
	}
	await this.get_user();
	await this.get_sport();
	await this.get_sports();
}

async get_user() {
	var user_id = this.props.params.userId;
	await $.ajax({
	    type: 'POST',
	    data:{ user_id:user_id },
	    dataType:'json',
	    url: 'http://10.90.90.55:3001/get_user_details',
	    success:function(response) {
	    	var userarray = $.makeArray(response.userdetails)
	        if (response.status == 'success') {
	        	this.setState({name:response.userdetails.user_name,
	        		email:response.userdetails.email,
	        		user:userarray})
	        }
	    }.bind(this)
	});
}

async get_sport() {
	var sport_id = this.props.params.sportId;
	await $.ajax({
	    type: 'POST',
	    data:{ sport_id:sport_id },
	    dataType:'json',
	    url: 'http://10.90.90.55:3001/get_sport_details',
	    success:function(response) {
	        if (response.status == 'success') {
	        	this.setState({sport:response.sportdetails.name})
	        }
	    }.bind(this)
	});
}

async exit_from_sport() {
	var sport_id = this.props.params.sportId;
	var user_id = this.props.params.userId;
	var data = { sport_id, user_id };
	await $.ajax({
	    type: 'POST',
	    dataType:'json',
	    url: 'http://10.90.90.55:3001/exit_from_sport',
	    data : data,
	    success:function(response) {
		    if (response.status == 'success') {
		    	this.send_response();
			}
			
	    }.bind(this),
	    error:function(err) {
			console.log(err);  
    	}
	});
}


async send_response() {
	var email = this.state.email;
  	await $.ajax({
      type: 'POST',
      url: 'http://10.90.90.55:3001/send_response',
      dataType:'json',
      data:{ email:email },
      success:function(response) {
        if (response.status == 'success') {
        	if (localStorage.user_id && localStorage.sport_id) {
				localStorage.removeItem('user_id');
				localStorage.removeItem('sport_id');
			}
        	$(".alert-success").show('slow');
        	setTimeout(() => {
				$(".alert-success").hide('slow');
				browserHistory.push('/adminhome')
			}, 3000);
        }  
      },
      error:function(err) {
        console.log(err);
      }
   	});
}


render(){
	$(document).ready(function() {
		$(".alert-success").hide();
	});
	
  return(
  	<div>
  		<Adminheader />
		<div class="container">
			<h2>Participant Requests</h2>
			<table class="table table-hover">
				<thead>
					<tr>
						<th>S.No</th>
						<th>Name</th>
						<th>Sport</th>
						<th>Approve</th>
						<th>Disapprove</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>{ this.state.name }</td>
						<td>{ this.state.sport }</td>
						<td><button class="btn btn-success btn-sm" type="submit" onClick={()=> {this.exit_from_sport()}}>Accept</button></td>
						<td><button class="btn btn-danger btn-sm">Reject</button></td>
					</tr>
				</tbody>

			</table>
			<div class="alert alert-success">
			  <strong>Request Accepted.........</strong>
			</div>
		</div>
  	</div>
  	);
}


}
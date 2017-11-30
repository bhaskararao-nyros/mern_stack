import React, { Component } from 'react';
import $ from "jquery";
import { browserHistory } from 'react-router';
import Workbook from 'react-excel-workbook';

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
	var sport_id = this.props.params.sportId;
	var user_id = this.props.params.userId;
	let path = `/adminlogin/${user_id}/${sport_id}`;
	if (!localStorage.Admin) {
		browserHistory.push(path);
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
	        if (response.status == 200) {
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
	        if (response.status == 200) {
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
		    if (response.status == 200) {
		    	this.send_response();
			}
			
	    }.bind(this),
	    error:function(err) {
			console.log(err);  
    	}
	});
}


async logout() {
	localStorage.removeItem('Admin');
	
	var sport_id = this.props.params.sportId;
	var user_id = this.props.params.userId;
	let path = `/adminlogin/${user_id}/${sport_id}`;

	browserHistory.push(path);
}


async send_response() {
	var email = this.state.email;
  	await $.ajax({
      type: 'POST',
      url: 'http://10.90.90.55:3001/send_response',
      dataType:'json',
      data:{ email:email },
      success:function(response) {
        if (response.status == 200) {
        	$(".alert-success").show('slow');
        	setTimeout(() => {
				$(".alert-success").hide('slow');
			}, 3000);
        }  
      },
      error:function(err) {
        console.log(err);
      }
   	});
}


async get_sports(){
 await $.ajax({
    type: 'POST',
    dataType:'json',
    url: 'http://10.90.90.55:3001/get_sports_details',
    success:function(response) {
	 	if (response.sportsdetails.length > 0) {
	 		this.setState({sports:response.sportsdetails});
	 	}  
    }.bind(this),
    error:function(err) {
		console.log(err);  
    } 
  });
}


render(){
	$(document).ready(function() {
		$(".alert-success").hide();
	});
	
	const example = (
	  <div className="row text-center" style={{marginTop: '100px'}}>
	    <Workbook filename="example.xlsx" element={<button className="btn btn-sm btn-primary">Try me!</button>}>
	      <Workbook.Sheet data={this.state.user} name="Sheet A">
	        <Workbook.Column label="Name" value="user_name"/>
	        <Workbook.Column label="Age" value="age"/>
	        <Workbook.Column label="Gender" value="gender"/>
	      </Workbook.Sheet>
	    </Workbook>
	  </div>
	)
  return(
  	<div>
  		<nav class="navbar navbar-default">
		  <div class="container-fluid">
		    <div class="navbar-header">
		      <a class="navbar-brand" href="#">Sports Comptetion</a>
		    </div>
		    <ul class="nav navbar-nav navbar-right">
		      <li><a href="#">Welcome...Admin</a></li>
		      <li><a href="" onClick={()=> {this.logout()}}>Logout</a></li>
		    </ul>
		  </div>
		</nav>
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
			<hr />
			{example}
			<h2>Sports Details</h2>
			<table class="table table-hover">
				<thead>
					<tr>
						<th>S.No</th>
						<th>Sport</th>
						<th>Participants Count</th>
						<th>Download</th>
					</tr>
				</thead>
				<tbody>
				{this.state.sports.map((sport,index)=>{
					return(
						<tr key={index}>
							<td>{index+1}</td>
							<td>{ sport.name }</td>
							<td>Sports Count</td>
							<td><button class="btn btn-info btn-sm">Download</button></td>
						</tr>
					);
				})}
				</tbody>

			</table>
		</div>
  	</div>
  	);
}


}
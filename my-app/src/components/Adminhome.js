import React, { Component } from 'react';
import $ from "jquery";
import { browserHistory } from 'react-router';
import Workbook from 'react-excel-workbook';
import Adminheader from './Adminheader.js';

export default class Adminhome extends Component {


constructor(props) {
  super(props);
  this.state = {
	user:[],
	sports:[],
	sports_count:[]
  }

  this.get_sports_count = this.get_sports_count.bind(this);
  this.download_user = this.download_user.bind(this);
}

async componentDidMount() {

	if (!localStorage.Admin) {
		browserHistory.push('/adminlogin');
	}

	await this.get_sports_count();
}

async get_sports_count() {
  await $.ajax({
      type: 'POST',
      url: 'http://10.90.90.55:3001/get_sports_count',
      dataType:'json',
      success:function(response) {
      	console.log(response.sports_count);
        this.setState({sports:response.sports_count})
      }.bind(this),
      error:function(err) {
        console.log(err);
      }
   });
}

async download_user(user_ids) {
	console.lo
}

render(){
	$(document).ready(function() {
		
	});

	
	const download = (
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
  		<Adminheader />
		<div class="container">
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
					{sport.count.map(function(sport1, index1){

					})}
					return(
						<tr key={index}>
							<td>{index+1}</td>
							<td>{ sport.name }</td>
							<td>{ sport.count.length }</td>
							<td>
							{sport.count.length > 0 ?
								<button className="btn btn-primary btn-sm" onClick={()=> {this.download_user(sport.count)}}>
								<span className="glyphicon glyphicon-download-alt"></span>
								</button> :  
								<button className="btn btn-warning btn-sm disabled">
								<span className="glyphicon glyphicon-download-alt"></span>
								</button>
							}
							</td>
						</tr>
					)
				})}
				</tbody>

			</table>
		</div>
  	</div>
  	);
}


}
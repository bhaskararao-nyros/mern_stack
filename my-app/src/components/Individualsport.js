import React, { Component } from 'react';
import Header from './Header.js';
import $ from "jquery";
import './../assets/css/App.css';
import { browserHistory } from 'react-router';

export default class Individualsport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			participants:[],
			sports:[],
			join_sports:[],
			sportname:'',
			sports_count:[]
		}
		this.get_sports = this.get_sports.bind(this);
		this.get_participant_details = this.get_participant_details.bind(this);
		this.get_all_sports = this.get_all_sports.bind(this);
		this.get_sports_count = this.get_sports_count.bind(this);
	}

	async componentDidMount() {
		if (!localStorage.userId) {
	        browserHistory.push('/login');
	    }
		await this.get_sports();
	    await this.get_participant_details();
	    await this.get_all_sports();
	    await this.get_sports_count();
	    
	}

	async get_participant_details() {
		var sport_id = this.props.params.sportId;
		await $.ajax({
		    type: 'POST',
		    dataType:'json',
		    url: 'http://10.90.90.55:3001/get_participant_details',
		    data:{sport_id:sport_id},
		    success:function(response) {
		        this.setState({ participants:response.data });
		    }.bind(this),
		    error:function(err) {
				console.log(err);  
	    	}
		});
	}

	async get_all_sports() {
		var sport_id = this.props.params.sportId;
		var user_id = localStorage.userId;
		var data = { sport_id, user_id };
		await $.ajax({
		    type: 'POST',
		    dataType:'json',
		    url: 'http://10.90.90.55:3001/get_all_sports',
		    data : data,
		    success:function(response) {
		       this.setState({ join_sports:response.data });
		    }.bind(this),
		    error:function(err) {
				console.log(err);  
	    	}
		});
	}


	async get_sports(){
	var sport_id = this.props.params.sportId;
	 await $.ajax({
	    type: 'POST',
	    dataType:'json',
	    url: 'http://10.90.90.55:3001/get_sports_details',
	    success:function(response) { 
		 	for (var i = 0; i < response.sportsdetails.length; i++) {
		 		if (response.sportsdetails[i]._id === sport_id) {
		 			this.setState({ sportname:response.sportsdetails[i].name })
		 		}
		 	}
	    }.bind(this),
	    error:function(err) {
			console.log(err);  
	    } 
	  });
	}

	async exit_from_sport() {
		var sport_id = this.props.params.sportId;
		var user_id = localStorage.userId;
		var data = { sport_id, user_id };
		await $.ajax({
		    type: 'POST',
		    dataType:'json',
		    url: 'http://10.90.90.55:3001/exit_from_sport',
		    data : data,
		    success:function(response) {
			    if (response.status == 'success') {
			    	$(".exist").show('slow');
					setTimeout(() => {
						this.get_participant_details();
						this.get_all_sports();
						this.get_sports_count();
					}, 3000);	
				}
				
		    }.bind(this),
		    error:function(err) {
				console.log(err);  
	    	}
		});
	}

	async join_in_sport(id) {
	  var sport_id = id;
	  var user_id = localStorage.userId;
	  var data = {sport_id, user_id };

	   await $.ajax({
	      type: 'POST',
	      url: 'http://10.90.90.55:3001/save_ids_to_sports',
	      data:data,
	      success:function(response) {
		      if (response.status == 'success') {
		      	$(".participate").show('slow');
					setTimeout(() => {
						this.get_all_sports();
						this.get_participant_details();
						this.get_sports_count();
					}, 3000);			
			  }
		  }.bind(this)
	   });
	}


	async get_sports_count() {
	  await $.ajax({
	      type: 'POST',
	      url: 'http://10.90.90.55:3001/get_sports_count',
	      dataType:'json',
	      success:function(response) {
	        // console.log(response.sports_count);  
	        this.setState({sports:response.sports_count})
	      }.bind(this),
	      error:function(err) {
	        console.log(err);
	      }
	   });
	}


	render(){
		$(document).ready(function() {
			$(".exist").hide();
			$(".participate").hide();
		})

    return (
      <div>
        <header>
          <Header />
        </header>     
           <div className="container">
            <div className="row">
             <div className="col-md-7">
               <div className="row">
             <h2>{ this.state.sportname } : Participants Details</h2><hr/>
             <div className="alert alert-info exist">
			  <strong>Successfully existed.......</strong>
			 </div>           		 
	                {this.state.participants.map(function(sport, index){
	                     return (
	                       <div className="well well-sm">
	                     	<div className="row">
	                     	  <div className="col-md-2">
	                     	  	<h5 className="badge">{index+1}</h5>
	                     	  </div>
	                     	  <div className="col-md-4">
	                     	  	{ localStorage.userName === sport.u_id[0].user_name ? 
				       			   	<h4> You </h4> : 
				       			   	<h4> {sport.u_id[0].user_name} </h4>
				       			}
	                     	  </div>
	                     	  <div className="col-md-2">
	                     	  	<h4>{sport.u_id[0].age}</h4>
	                     	  </div>
	                     	  <div className="col-md-4">
	                     	  <h5>
	                     	  	{localStorage.userId === sport.u_id[0]._id ? 
				       			   <button className="btn btn-danger btn-xs" type="submit" onClick={()=> {this.exit_from_sport()}}>Quit</button> : ''}
	                     	  </h5>
	                     	  </div>
	                     	</div>
	                       </div>
				       			)
	                }.bind(this))}
    		 </div>
             </div>
             <div className="col-md-5">
             <h2 className="text-center">Sports Status</h2><hr/>
             <div className="alert alert-info participate">
			  <strong>Successfully participated.......</strong>
			 </div>
            	<ul className="well">
            	{	this.state.sports.map((sport,index)=>{
            			let is_participate = false;
            			this.state.join_sports.map((j_spt,index)=>{
            				if(sport.sport_id === j_spt.s_id[0]){
            					is_participate = true;
            				}
            			});
            			return(
            				<li id="sportstatus">{ is_participate ? 
            				<h3>{sport.name} -  
            						<span>({ sport.count })</span>
            				<small className="pull-right"><span className="glyphicon glyphicon-ok"></span> Participated</small></h3>:
            				<h3>{sport.name} - 
            						<span>({ sport.count })</span>
            				<button className="btn btn-info btn-xs pull-right" onClick={()=> {this.join_in_sport(sport.sport_id)}}>Participate</button> 
            				</h3>}
            				</li>
            			)
            		})
            	}
            	</ul>	
             </div>
            </div>
           </div>
      </div>
    );
  }
}

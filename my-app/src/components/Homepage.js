import React, { Component } from 'react';
import Header from './Header.js';
import { browserHistory, Link } from 'react-router';
import $ from "jquery";

export default class Homepage extends Component {
constructor(props) {
  super(props);
  this.state = {
     sports:[],
     request_sport_id:'',
    }

    this.get_sports_count = this.get_sports_count.bind(this);
    this.send_request = this.send_request.bind(this);
}

async componentDidMount() {
    if (!localStorage.userId) {
        browserHistory.push('/login');
    } else {
        browserHistory.push('/');
    }

    await this.get_sports_count();
   
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
      // console.log(response); 
        this.setState({sports:response.sports_count})
      }.bind(this)
   });
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


async send_request(id) {
  var email = 'bhaskargummidi@gmail.com';
  var user_id = localStorage.userId;
  var sport_id = id;
  var data = {email, user_id, sport_id};
  await $.ajax({
      type: 'POST',
      url: 'http://10.90.90.55:3001/send_request_for_exit',
      dataType:'json',
      data:data,
      success:function(response) {
       if (response.status == 'success') {
        this.setState({request_sport_id:id})
       }
      }.bind(this),
      error:function(err) {
        console.log(err);
      }
   });
}

render(){

return (
  <div>
    <header>
       <Header />
    </header>
      <div className="container">
       <div className="row">
          
        {this.state.sports.map(function(sport, index){  
          let is_participate = false;
          {sport.count.map(function(sport1, index1){
            if (localStorage.userId === sport1.u_id[0] ) {
              is_participate = true;
            }
          }.bind(this))}

           return (
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 sports_item" key={index}>
                <div className="breadcrumb border_hover">
                  <h3 className="text-center">{sport.name}</h3>
                  <img src={require('./../assets/images/'+sport.name+'.jpg')} width="330" height="200"/><br/><br/>
                  <div id="link">
                  { is_participate?
                    <div>
                  <button className="btn btn-success btn-sm" type="submit">Joined</button> 
                  <a className="btn request" onClick={()=> {this.send_request(sport.sport_id)}}>{this.state.request_sport_id === sport.sport_id ? 'Pending....' : 'Request for Exit'}</a>
                  </div>
                  :
                  <button className="btn btn-primary btn-sm" type="submit" onClick={()=> {this.join_in_sport(sport.sport_id)}} >JOIN</button>
                  }
                    <Link to = {{ pathname:'/join_in_sport/' +sport.sport_id }}>
                    <span className="pull-right"> 
                      <h4 id="members">{ sport.count.length } { sport.count.length === 1 ? 'Member' : 'Members'}</h4>
                    </span>
                    </Link>
                  </div> 
                </div>
              </div>
          )
      
        }.bind(this))}
      </div> 
    </div>    
  </div>
);
}
}


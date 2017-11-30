import React, { Component } from 'react';
import $ from "jquery";
import './../assets/css/App.css';
import Header from './Header.js';
import Register from './Register.js';
import Login from './Login.js';
import Homepage from './Homepage.js';
import { browserHistory } from 'react-router';
// import { Form,FormGroup,FormControl,ControlLabel,Col,Button,Checkbox } from 'react-bootstrap';

class App extends Component {
constructor(props) {
  super(props);
  this.state = {
      loginpage:false,
      totalcount:''
    }

this.changepage = this.changepage.bind(this);
this.signuppage = this.signuppage.bind(this);
  }

  async componentDidMount() {
    if (localStorage.userId) {
      browserHistory.push('/');
    } else {
      browserHistory.push('/login');
    }

    await this.get_total_participants();
  }

  async changepage(event) {
    event.preventDefault();
    this.setState({ 
        loginpage:true
      })
  }

  async signuppage(event) {
    event.preventDefault();
    this.setState({ 
        loginpage:false
      })
  }

  async get_total_participants() {
      await $.ajax({
      type: 'POST',
      url: 'http://10.90.90.55:3001/get_total_participants',
      success:function(data) {
        // console.log(data);
         this.setState({totalcount:data.total_count.length})
      }.bind(this)
    });
  }

  render(){

    var totalparticipants = this.state.totalcount

    return (
      <div>
        <header>
          <Header changepage={ this.changepage } signuppage={ this.signuppage } />
        </header>
          <div className="row">
            <div className="col-md-8"><br /><br />  
              <h1 className="text-center">Inter School Sports Comptetion</h1><br /><br />  
              <img src={ require('./../assets/images/sports.jpg') } width="800px" />
              <h4 className="text-center"><b className="total badge totalbadge">{totalparticipants}</b> members participated</h4>
            </div>
            <div className="col-md-4">
                { this.state.loginpage ? <Login /> : <Register /> } 
            </div>
          </div>   
      </div>
    );
  }
}
export default App;

import React, { Component } from 'react';
import $ from "jquery";
import './../assets/css/App.css';
import Header from './Header.js';
import Register from './Register.js';
import Login from './Login.js';
import Homepage from './Homepage.js';
// import { Form,FormGroup,FormControl,ControlLabel,Col,Button,Checkbox } from 'react-bootstrap';

class App extends Component {
constructor(props) {
  super(props);
  this.state = {
      loginpage:false
    }

this.changepage = this.changepage.bind(this);
  }

  changepage(event) {
    event.preventDefault();
    this.setState({ 
        loginpage:true
      })
  }

  render(){
    return (
      <div>
        <header>
          <Header changepage={ this.changepage } />
        </header>     
           { this.state.loginpage ? <Login /> : <Register /> } 
      </div>
    );
  }
}
export default App;

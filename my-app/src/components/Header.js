import React, { Component } from 'react';
import { Navbar,Nav,NavItem,MenuItem,NavDropdown } from 'react-bootstrap';
import { browserHistory } from 'react-router';

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn:false
		}
	}

	componentDidMount() {
	    if (localStorage.userId) {
	        this.setState({loggedIn:true});
	    }
	}

	logout() {
		localStorage.removeItem('userId');
		localStorage.removeItem('userName');
	}

	render() {
		return(
			<Navbar>
			    <Navbar.Header>
			      <Navbar.Brand>
			        <a href="/">Sports Comptetion</a>
			      </Navbar.Brand>
			    </Navbar.Header>
			    {this.state.loggedIn ? 
			    	<Nav pullRight>
			    		<NavItem eventKey={1} href={"/userdetails/" + localStorage.userId }>Welcome...{ localStorage.userName }</NavItem>
			        	<NavItem eventKey={2} href="/" onClick={this.logout}>Logout</NavItem>
			        </Nav>
			        :
			        <Nav pullRight>
				    	<NavItem eventKey={1} href="/" onClick={this.props.signuppage}>Signup</NavItem>
				        <NavItem eventKey={2} href="/login" onClick={this.props.changepage}>Signin</NavItem>
			       	</Nav>
			    }
			</Navbar>
			);
	}
}
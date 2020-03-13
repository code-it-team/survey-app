/** @format */

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from "reactstrap";

const navStyle = { fontSize: 25 };

export default class Header extends Component {
  constructor( props) {
    super(props);
    this.state = {
      isNavOpen: false
    };
  }
  toggle = () => {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  };

  render() {
    return (
      <div>
        <Navbar dark expand="md" style={navStyle} color="dark">
          <NavbarBrand href="/" className="mr-auto">
            <img src="/survey.svg" height="50px" alt="logo" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse navbar isOpen={this.state.isNavOpen}>
            <Nav navbar className="ml-auto">
              <NavItem>
                <Button className="m-2" outline onClick={() => this.props.logout()}>
                  <i className="fa fa-sign-out"></i> Logout
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

// prop types
Header.propTypes = {
  logout: PropTypes.func.isRequired
};

/** @format */

import React, { Component } from "react";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from "reactstrap";

const navStyle = { fontSize: 25, backgroundColor: "#1C8EF9" };

export default class Header extends Component {
  constructor(props) {
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
        <Navbar dark expand="md" style={navStyle}>
          <NavbarBrand href="/" className="mr-auto">
            <img src="/survey.svg" height="40px" alt="logo" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse navbar isOpen={this.state.isNavOpen}>
            <Nav navbar className="ml-auto">
              <NavItem>
                <NavLink>
                  <i class="fa fa-sign-in"></i> Login
                </NavLink>
              </NavItem>
              <NavItem className="ml-5">
                <NavLink>
                  <i class="fa fa-user-plus"></i> Signup
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

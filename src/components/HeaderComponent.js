/** @format */

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from "reactstrap";
import * as ROUTES from "../shared/routes";

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
      <div className="mb-3">
        <Navbar dark expand="md" color="dark" fixed="top">
          <NavbarBrand href={ROUTES.HOME} className="mr-auto">
            <img src="/survey.svg" height="30px" alt="logo" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse navbar isOpen={this.state.isNavOpen}>
            <Nav navbar className="ml-auto">
              {/* <NavItem>
                <NavLink href="/surveys">Surveys</NavLink>
              </NavItem> */}
              <NavItem>
                <Button
                  className="m-2"
                  outline
                  onClick={() => this.props.logout()}
                >
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

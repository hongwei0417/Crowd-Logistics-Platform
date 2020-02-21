import React, { Component } from 'react';
import { Nav, Navbar, Form, NavDropdown, FormControl, Button } from 'react-bootstrap'
import { store } from '../index'
import { logout } from '../actions/userAction'

const handleLogout = () => {
  store.dispatch(logout())
}

const navbar = (props) => {

  return (
    <Navbar bg="dark" expand="md" variant="dark">
      <Navbar.Brand href="/home">Crowd-Logistics-Platform</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/buy">Shop</Nav.Link>
          <Nav.Link href="/delivery">Delivery</Nav.Link>
          {
            // <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            //   <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            //   <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            //   <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            //   <NavDropdown.Divider />
            //   <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            // </NavDropdown>
          }
        </Nav>
        {/* <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success" variant="outline-light">Search</Button>
        </Form> */}
        <Button variant="outline-success" variant="outline-light" onClick={handleLogout}>Logout</Button>

      </Navbar.Collapse>
    </Navbar>
  );
}
 
export default navbar;
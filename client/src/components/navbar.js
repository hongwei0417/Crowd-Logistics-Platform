import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap'
import { store } from '../index'
import { logout } from '../actions/userAction'
import axios from 'axios'
import { useLocation, useHistory } from 'react-router-dom'

const handleLogout = () => {
  store.dispatch(logout())
}

const MyNavbar = () => {

  const [userCount, setUserCount] = useState(0);
  const location = useLocation();

  const test = async () => {
    const res = await axios.get('http://localhost:5000/users/getUsersCount')
    await setUserCount(res.data)
  }

  useEffect(() => {
    test()
  })
  
  return (
    <Navbar bg="dark" expand="md" variant="dark">
      <Navbar.Brand href="/home">Crowd-Logistics-Platform</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home" active={location.pathname == '/home'}>Home</Nav.Link>
          <Nav.Link href="/buy" active={location.pathname == '/buy'}>Shop</Nav.Link>
          <Nav.Link href="/delivery" active={location.pathname == '/delivery'}>Delivery</Nav.Link>
          <div className='d-flex justify-content-center align-items-center ml-3'>
            <span className='text-warning'>{`目前線上人數：${userCount}`}</span>
          </div>
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
 
export default MyNavbar;
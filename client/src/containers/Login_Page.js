import React, { Component } from 'react';
import { Form, Button  } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'; 
import styles from '../css/Login_Page.module.css'


class Login_Page extends Component {
  state = {
    email: '',
    password: '',
    checkout: false,
  }

  
  set_email = (e) => {
    this.setState({ email: e.target.value });
  }

  set_password = (e) => {
    this.setState({ password: e.target.value });
  }

  set_checkout = (e) => {
    this.setState({ checkout: e.target.value });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = this.state

    const data = {
      email: email,
      password: password
    }

    
    if(email != '' || password != '') {
      const res = await axios.post('http://localhost:5000/users/login', data)
      console.log(res.data)
    }

    const result = await axios.get('http://localhost:5000/users')
    console.log(result)

  }


  render() { 
    return (
      <div className={styles.flexbox}>
        <div className={styles.loginBox}>
          <div className={styles.topic}>LOGIN</div>
          <Form className={styles.form} onSubmit={(e) => this.onSubmit(e)}>
            <Form.Group className={styles['form-group']}>
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={this.set_email}/>
            </Form.Group>
            <Form.Group className={styles['form-group']}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={this.set_password}/>
            </Form.Group>
            <Form.Group className={styles['form-group']}>
              <Form.Check type="checkbox" label="Check me out" onChange={this.set_checkout}/>
            </Form.Group>
            <Button variant="primary" type="submit" block>
              Submit
            </Button>
          </Form>
          <Link to='/register'>Register</Link>
        </div>
      </div>
    );
  }
}


export default Login_Page;
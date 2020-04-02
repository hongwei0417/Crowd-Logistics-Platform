import React, { Component } from 'react';
import { Form, Button, Col, InputGroup, FormControl  } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'; 
import styles from '../css/Register_Page.module.css'
import { connect } from 'react-redux'



class Register_Page extends Component {
  state = {
    username: '',
    phone: '',
    email: '',
    password: '',
    psd_again: '',
  }

  componentDidMount() {
    console.log(this.props)
  }


  set_username = (e) => {
    this.setState({ username: e.target.value });
  }

  set_phone = (e) => {
    this.setState({ phone: e.target.value });
  }
  
  set_email = (e) => {
    this.setState({ email: e.target.value });
  }

  set_password = (e) => {
    this.setState({ password: e.target.value });
  }

  set_psd_again = (e) => {
    this.setState({ psd_again: e.target.value });
  }

  check_email = async () => {
    const { email } = this.state
    if(email != '') {
      const res = await axios.post('http://localhost:5000/users/check_email', { email })

      console.log(res.data)
      if(res.data) {
        alert('可以使用此信箱!')
      } else {
        alert('此信箱已被註冊!')
      }
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { username, phone, email, password, psd_again } = this.state

    if(email == '' || password == '', username == '', phone == '', psd_again =='') {
      alert('請勿空白!')
      return
    }

    if(password != psd_again) {
      alert('密碼確認錯誤!')
      return
    }

    const data1 = {
      email: email,
      password: password,
      username: username,
      phone_number: phone,
    }
    
    const res1 = await axios.post('http://localhost:5000/users/register', data1)
    let fail = false
    console.log(res1.data)

    if(res1.data.status) {
      const data2 = {
        uid: res1.data.data._id,
        driver_license: "xxxxxxxxxx",
        license_plate: "xxxxxxxxxx",
        insurance: "xxxxxxxxxx",
        drunk_driving: "xxxxxxxxxx",
        delivery_start_time: "8",
        delivery_end_time: "14",
        regular_place: "台中市"
      }
      const res2 = await axios.post('http://localhost:5000/drivers/add', data2)

      console.log(res2.data)

      if(res2.data.stauts) {
        alert('註冊成功! 請輸入帳密登入')
        this.props.history.replace({pathname: '/'})
      } else {
        fail = true
      }
    } else {
      fail = true
    }

    if(fail) alert("註冊失敗！")
  }


  render() { 
    return (
      <div className={styles.flexbox}>
        <div className={styles.loginBox}>
          <div className={styles.topic}>Register</div>
          <Form className={styles.form} onSubmit={(e) => this.onSubmit(e)}>
            <Form.Group className={styles['form-group']}>
              <Form.Label>Nickname</Form.Label>
              <Form.Control type="text" placeholder="Your name" onChange={this.set_username}/>
            </Form.Group>
            <Form.Group className={styles['form-group']}>
              <Form.Label>Phone number</Form.Label>
              <Form.Control type="text" placeholder="Phone number" onChange={this.set_phone}/>
            </Form.Group>
            <div className={styles.line}></div>
            <Form.Group className={styles.verify_group}>
              <Form.Label>Email address</Form.Label>
              <Form.Row>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter email"
                    aria-label="Enter email"
                    aria-describedby="basic-addon2"
                    type='email'
                    onChange={this.set_email}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-info" onClick={this.check_email}>Verify</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Row>
            </Form.Group>
            <Form.Group className={styles['form-group']}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={this.set_password}/>
            </Form.Group>
            <Form.Group className={styles['form-group']}>
              <Form.Label>Password confirmation</Form.Label>
              <Form.Control type="password" placeholder="Password again" onChange={this.set_psd_again}/>
            </Form.Group>
            <Button className={styles.submit} variant="primary" type="submit" block>
              Register
            </Button>
          </Form>
          <Link to='/'>Back to login</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }
}


export default connect(mapStateToProps)(Register_Page);
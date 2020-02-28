import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Image } from 'react-bootstrap'


class carrying_page extends Component {

  state = {
    deliveryText: "",
    textInterval: null
  }
  
  async componentDidMount() {
    this.start_delivery_text()
  }

  async componentWillUnmount() {
    clearInterval(this.state.textInterval)
  }

  start_delivery_text = () => {
    let n = 0
    const interval = setInterval(() => {
      let text = "司機正在運送中"
      if(n > 4) {
        n = 0;
        text = "司機正在運送中"
      } else {
        n += 1;
      }
      for(let i = 0; i < n; i++) {
        text += "·"
      }
      this.setState({
        deliveryText: text
      })
    }, 300)
    this.setState({textInterval: interval})
  }

  render() {
    return (
      <div className='d-flex justify-content-center'>
        <Image fluid src="https://i1.wp.com/inc42.com/wp-content/uploads/2019/07/food-delivery.jpg?fit=1360%2C1020&ssl=1"/>
        <div className='position-absolute mt-4 font-weight-bold' style={{fontSize: '30px'}}>{this.state.deliveryText}</div>
      </div>
    )
  }
}



export default connect()(carrying_page)

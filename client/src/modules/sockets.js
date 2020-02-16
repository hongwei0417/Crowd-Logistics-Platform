import io from 'socket.io-client'
import { store } from '../index'
import { addOrder } from '../actions/txnAction'


class Socket {

  constructor(user) {
    this.socket = io('http://localhost:5000');
    this.connect(user)
  }

  connect(user) {
    this.socket.on('connect', () => {
      this.socket.emit('create', { [user._id]: this.socket.id });
      console.log(this.socket.id)
    });
  }

  listenOrder() {
    this.socket.on('sendOrder', (order) => {
      store.dispatch(addOrder(order))
    });
    console.log('Order listening!')
  }
}

export default Socket


import io from 'socket.io-client'
import { store } from '../index'
import { addOrder, updateSendingStatus } from '../actions/txnAction'


class Socket {

  constructor(user) {
    this.socket = io('http://localhost:5000');
    this.connect(user)
  }

  connect(user) {
    this.socket.on('connect', () => {
      this.socket.emit('create', { [user._id]: this.socket.id });
      this.id = this.socket.id
      console.log(this.socket.id)
    });
  }

  listenOrderComing() {
    this.socket.on('sendOrder', (order) => {
      store.dispatch(addOrder(order))
    });
    console.log('Order coming listening!')
  }

  listenOrderStatus() {
    this.socket.on('updateSendingStatus', (orderDoc) => {
      store.dispatch(updateSendingStatus(orderDoc))
      alert('已接受到訂單訊息');
    });
    console.log(`${this.id}: Order status listening!`)
  }

  
}

export default Socket


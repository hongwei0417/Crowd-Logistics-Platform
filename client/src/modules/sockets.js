import io from 'socket.io-client'
import { store } from '../index'
import { addOrder, updateOrder } from '../actions/txnAction'


class Socket {

  constructor(user) {
    this.socket = io('http://localhost:5000');
    this.listenConnect(user)
  }

  listenConnect(user) {
    this.socket.on('connect', () => {
      this.socket.emit('create', { [user._id]: this.socket.id });
      this.id = this.socket.id
      this.listenOrderComing()
      this.listenOrderUpdate('sender', 'updateOrder')
      this.listenOrderUpdate('driver', 'confirmOrder')
    });
  }

  listenOrderComing() {
    this.socket.on('sendOrder', (orderDoc) => {
      store.dispatch(addOrder(orderDoc))
    });
    console.log(`司機方 [${this.id}]: 開始監聽 sendOrder`)
  }

  listenOrderUpdate(who, event) {
    const { txnState } = store.getState()

    if(txnState[who].currentOrder) {
      this.socket.on(event, (orderDoc) => {
        //回傳訂單資料
        store.dispatch(updateOrder(orderDoc, who))
      });
      console.log(`${who == "sender" ? '寄送方' : '司機方'} [${this.id}]: 開始監聽 ${event}`)
    }
  }

  emitTo(uid, event, data) {
    this.socket.to(uid).emit(event, data);
  }

  removeEvent(name) {
    this.socket.off(name);
    console.log(`${this.id} 訂單監聽已結束!`)
  }

}

export default Socket


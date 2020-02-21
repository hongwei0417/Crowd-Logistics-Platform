export const newTXN = (payload) => ({
  type: 'NEW_TXN',
  receipt: payload.receipt,
  orderSending: payload.orderSending
})

export const newBcValue = (payload) => ({
  type: 'NEW_BCVALUE',
  bcValue: payload
})


export const updateSendingStatus = ({orderSending, orderDoc}) => ({
  type: 'UPDATE_SEND_STATUS',
  orderSending,
  orderDoc
})

export const updateOrderList = (payload) => ({
  type: 'UPDATE_ORDER_LIST',
  orderList: payload
})

export const updateOrderStatus = (payload, status) => {

  let currentOrder = payload

  if(status == "refused") {
    currentOrder = null
  }

  return {
    type: 'UPDATE_ORDER_STATUS',
    currentOrder: currentOrder
  }
}

export const addOrder = (payload) => ({
  type: 'NEW_ORDER',
  currentOrder: payload
})

export const clearTXN = () => ({
  type: 'CLEAR_TXN',
})

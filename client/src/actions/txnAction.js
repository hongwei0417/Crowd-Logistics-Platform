export const newTXN = (payload) => ({
  type: 'NEW_TXN',
  receipt: payload,
})

export const newBcValue = (payload) => ({
  type: 'NEW_BCVALUE',
  bcValue: payload
})

export const updateOrderList = (payload) => ({
  type: 'UPDATE_ORDER_LIST',
  orderList: payload
})

export const addOrder = (payload) => ({
  type: 'NEW_ORDER',
  currentOrder: payload
})

export const clearTXN = () => ({
  type: 'CLEAR_TXN',
})

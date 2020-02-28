
export const updateOrder = (payload, who) => ({
  type: 'UPDATE_ORDER_STAUTS',
  currentOrder: payload,
  client: who,
})

export const addOrder = (payload) => ({
  type: 'NEW_ORDER',
  currentOrder: payload
})

export const clearTXN = () => ({
  type: 'CLEAR_TXN',
})

export const newTXN = (payload) => ({
  type: 'NEW_TXN',
  receipt: payload
})

export const clearTXN = () => ({
  type: 'CLEAR_TXN',
})

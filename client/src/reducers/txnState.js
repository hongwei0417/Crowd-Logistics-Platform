const initialState = {
  orderComing: false,
  orderList: []
}

export default (state = initialState, action) => {
  switch (action.type) {

  case 'NEW_TXN':
    return { 
      ...state,
      receipt: action.receipt,
    }

  case 'NEW_BCVALUE':
    return {
      ...state,
      bcValue: action.bcValue,
    }

  case 'NEW_ORDER':
    return {
      ...state,
      currentOrder: action.currentOrder,
      orderComing: true,
      orderList: [
        ...state.orderList,
        action.currentOrder
      ]
    }

  case 'UPDATE_ORDER_LIST':
    return {
      ...state,
      orderList: action.orderList
    }

  case 'CLEAR_TXN':
    return initialState;

  default:
    return state
  }
}

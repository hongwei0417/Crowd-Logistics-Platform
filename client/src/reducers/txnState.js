const initialState = {
  orderComing: false,
  orderSending: false,
  currentOrder: null,
  bcValue: null,
  receipt: null,
  // orderList: []
}

export default (state = initialState, action) => {
  switch (action.type) {

  case 'NEW_TXN':
    return { 
      ...state,
      receipt: action.receipt,
      orderSending: action.orderSending
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
    }

  case 'UPDATE_SEND_STATUS':
    return {
      ...state,
      orderSending: action.orderSending,
      currentOrder: action.orderDoc
    }

  case 'UPDATE_ORDER_LIST':
    return {
      ...state,
      orderList: action.orderList
    }

  case 'UPDATE_ORDER_STATUS':
    return {
      ...state,
      orderComing: false,
      currentOrder: action.currentOrder,
    }

  case 'CLEAR_TXN':
    return initialState

  case 'LOGOUT':
    return initialState;

  default:
    return state
  }
}

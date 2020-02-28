const initialState = {
  sender: {
    currentOrder: null,
  },
  driver: {
    currentOrder: null,
  }
}

export default (state = initialState, action) => {
  switch (action.type) {

  //更新訂單
  case 'UPDATE_ORDER_STAUTS':
    return {
      ...state,
      [action.client]: {
        ...state[action.client],
        currentOrder: action.currentOrder
      }
    }

  //更新司機方
  case 'NEW_ORDER':
    return {
      ...state,
      driver: {
        ...state.driver,
        currentOrder: action.currentOrder,
      }
    }

  case 'CLEAR_TXN':
    return initialState

  case 'LOGOUT':
    return initialState;

  default:
    return state
  }
}

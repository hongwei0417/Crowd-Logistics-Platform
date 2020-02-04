const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {

  case 'NEW_TXN':
    return { 
      ...state,
      receipt: action.receipt
    }

  case 'CLEAR_TXN':
    return initialState;

  default:
    return state
  }
}

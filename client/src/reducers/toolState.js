const initialState = {
  socket: null
}

export default (state = initialState, action) => {
  switch (action.type) {

  case 'NEW_SOCKET':
    return {
      socket: action.socket
    }

  case 'LOGOUT':
    return initialState;

  default:
    return state
  }
}

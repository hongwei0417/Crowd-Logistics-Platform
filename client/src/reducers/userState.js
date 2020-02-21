import storage from "redux-persist/lib/storage";
import { REHYDRATE } from 'redux-persist'

const initialState = {
  user: null,
  firstLoading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
  // case REHYDRATE:
  //   if (action.payload) {
  //     const incoming = action.payload.userState;
  //     console.log(action.payload)
  //     return {
  //       ...state,
  //       ...incoming,
  //     };
  //   } else {
  //     return state;
  //   }
  case 'LOGIN':
    return { 
      ...state,
      user: action.payload
    };
  case 'UPDATE_FIRST_LOADING':
    return {
      ...state,
      firstLoading: action.status
    }

  case 'LOGOUT':
    storage.removeItem('persist:root')
    return initialState
    
  default:
    return state
  }
};


import { combineReducers } from 'redux'
import userState from './userState'
import txnState from './txnState'



export default combineReducers({
  userState,
  txnState
});
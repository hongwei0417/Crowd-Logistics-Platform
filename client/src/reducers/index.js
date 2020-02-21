import { combineReducers } from 'redux'
import userState from './userState'
import txnState from './txnState'
import toolState from './toolState'



export default combineReducers({
  userState,
  txnState,
  toolState
});
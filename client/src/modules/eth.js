import Web3 from "web3";
import Sender from '../contracts/Sender.json'
import ethFile from '../eth.json';
import { wei_to_ether, ether_to_wei } from './tools'

export const getWeb3 = () => {
  const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
  const web3 = new Web3(provider);

  return web3;
}

export const getOrder = async (user, txnTime) => {

  const web3 = getWeb3();
  
  const accounts = await web3.eth.getAccounts();
 
  const contract = new web3.eth.Contract(Sender.abi, ethFile.sender_addr);

  const options = { from: accounts[0], gas: 6721975, gasPrice: 20000000000 };

  const result = await contract.methods.get_order_info(user.account.address, txnTime).call(options);

  return result;
}

export const get_shipping_fee = (gas, convert) => {

  const wei = gas * (10**10)

  if(convert) {
    return wei_to_ether(wei)
  } else {
    return wei
  }

}



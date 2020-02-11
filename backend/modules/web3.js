import getWeb3 from '../getWeb3'

export default async () => {
  try {
    global.web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    console.log("Web3 is connecting!")
    return web3;
  } catch(e) {
    console.log(e)
  }
  
}
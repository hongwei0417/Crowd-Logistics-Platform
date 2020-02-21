// import eth_wal from 'ethereumjs-wallet'
// import hdkey from 'ethereumjs-wallet/hdkey'
import { Transaction } from 'ethereumjs-tx'
import cTransaction from '../contracts/Transaction.json'

export const newAccount = async () => {

  const newAccount = await web3.eth.accounts.create()
  
  return newAccount
}

export const getBalance = async (addr) => {

  const balance = await web3.eth.getBalance(addr)

  return balance
}

export const sendEther = async (addr, ether) => {

  const accounts = await web3.eth.getAccounts()

  const receipt = await web3.eth.sendTransaction({
    from: accounts[0],
    to: addr,
    value: ether
  })

  return receipt
}


export const t = async () => {

  const accounts = await web3.eth.getAccounts();

  // web3.eth.accounts.wallet.create(2)

  // const wallet = web3.eth.accounts.wallet;

  // console.log(wallet)

  // const r1 = await web3.eth.sendTransaction({
  //   from: accounts[0],
  //   to: '0xb76ffB0b1DEf2B567243c91f0Daa4654D0e0e5b6',
  //   value: '60000000000000000'
  // })

  var privateKey = new Buffer.from("43652e75e292504b8fc83f52a39eea408ea32cdc94e3442d5c1a5c1f0241fc23", 'hex')

  const n = await web3.eth.getTransactionCount("0xb76ffB0b1DEf2B567243c91f0Daa4654D0e0e5b6")
  console.log(n)
  var rawTx = {
    nonce: web3.utils.toHex(n),
    from: "0xb76ffB0b1DEf2B567243c91f0Daa4654D0e0e5b6",
    to: "0xE2b4452EF907c68D1706E6792446A20d7f20a029",
    value: web3.utils.toHex(50000000000000),
    gas: web3.utils.toHex(6721975)
  }
  
  var tx = new Transaction(rawTx);
  tx.sign(privateKey);
  
  var serializedTx = tx.serialize();

  const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))

  // const r2 = await web3.eth.sendTransaction({
  //   from: '0xE2b4452EF907c68D1706E6792446A20d7f20a029',
  //   to: '0x9618Ad466524d4509bA6756c4a8713D85017AC0A',
  //   value: '10000000000000000',
  //   gas: 6721975
  // })



  // console.log(r1)
  // console.log(r2)

  const b1 = await web3.eth.getBalance("0xE2b4452EF907c68D1706E6792446A20d7f20a029")
  const b2 = await web3.eth.getBalance("0xb76ffB0b1DEf2B567243c91f0Daa4654D0e0e5b6")

  console.log(b1)
  console.log(b2)

  

  // accounts.push(newAccount.address)
  // console.log(hdwallet.getWallet())
  // console.log(wallet)
  
  // console.log(address)
}
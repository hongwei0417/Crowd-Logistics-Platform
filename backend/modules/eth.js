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
  const wei = web3.utils.toWei(ether, 'ether')

  let accountNumber = 0

  for(let i = 0; i < accounts.length; i++) {
    const balance = await web3.eth.getBalance(accounts[i])
    if(balance < wei) continue
    else {
      accountNumber = i;
      break;
    }
  }

  const receipt = await web3.eth.sendTransaction({
    from: accounts[accountNumber],
    to: addr,
    value: web3.utils.toWei(ether, 'ether')
  })

  return receipt
}


export const sendEtherToOthers = async (senderData, receiverData, ether) => {

  // web3.eth.accounts.wallet.create(2)

  // const wallet = web3.eth.accounts.wallet;

  // console.log(wallet)

  // const r1 = await web3.eth.sendTransaction({
  //   from: accounts[0],
  //   to: '0xb76ffB0b1DEf2B567243c91f0Daa4654D0e0e5b6',
  //   value: '60000000000000000'
  // })


  var privateKey = new Buffer.from((senderData.privateKey).slice(2), 'hex')

  const n = await web3.eth.getTransactionCount(senderData.address)
  console.log(n)
  var rawTx = {
    nonce: web3.utils.toHex(n),
    from: senderData.address,
    to: receiverData.address,
    value: web3.utils.toHex(ether),
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

  const b1 = await web3.eth.getBalance(senderData.address)
  const b2 = await web3.eth.getBalance(receiverData.address)

  console.log(receipt)

  console.log(b1)
  console.log(b2)

  return receipt

  // accounts.push(newAccount.address)
  // console.log(hdwallet.getWallet())
  // console.log(wallet)
  
  // console.log(address)
}
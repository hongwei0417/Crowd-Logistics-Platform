import { Router } from 'express' 
import Transaction from '../models/transaction_model'
import { sendEther } from '../modules/eth'

const router = Router()


const initTransaction = async (req, res) => {
  if(req.params.uid) {
    const newTransaction = new Transaction({
      "uid": req.params.uid,
    })

    await newTransaction.save()
    
    res.json("Transaction init ok!")
  }
}

const addTransactions = async (req, res) => {
  const { hash } = req.body
  
  const result = await Transaction.updateOne(
  { "uid": req.params.uid },
  { "$push": { "transactions": hash }})
  
  console.log(result.n)
  console.log(result.nModified)
  
  if(result.n > 0) {
    res.json("Add OK!")
  } else {
    res.json("Add failed!")
  }
  
}

const getTransactions = async (req, res) => {
  Transaction.findOne({uid: req.params.uid})
    .exec((error, txs) => {
      if(error) {
        console.log(error)
        res.json(error)
        return
      }

      if(txs) {
        res.json(txs.transactions)
      } else {
        res.json(false)
      }
    })
}

const sendEtherToUser = async (req, res) => {
  const { address, ether } = req.body
  const receipt = await sendEther(address, ether)

  res.json(receipt)
}

router.route('/init/:uid').post(initTransaction)
router.route('/add/:uid').post(addTransactions)
router.route('/get/:uid').post(getTransactions)
router.route('/sendEther').post(sendEtherToUser)

export default router
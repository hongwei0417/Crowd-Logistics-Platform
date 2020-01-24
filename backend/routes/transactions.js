import { Router } from 'express' 
import Transaction from '../models/transaction_model'

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

router.route('/init/:uid').post(initTransaction)
router.route('/add/:uid').post(addTransactions)
router.route('/get/:uid').post(getTransactions)

export default router
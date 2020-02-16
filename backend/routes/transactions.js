import { Router } from 'express' 
import Transaction from '../models/transaction_model'
import { sendEther } from '../modules/eth'

const router = Router()

const addTransactions = async (req, res) => {
  const { uid, txnTime, receipt } = req.body

  const newTransaction = new Transaction({uid, txnTime, receipt})
  
  const result = await newTransaction.save()
  
  res.json(result)
  
}

const getTransactions = async (req, res) => {
  const result = await Transaction.find({uid: req.params.uid}).exec()
  res.json(result)
}


const sendEtherToUser = async (req, res) => {
  const { address, ether } = req.body
  const receipt = await sendEther(address, ether)

  res.json(receipt)
}


const test = async (req, res) => {
  io.to(req.body.uid).emit('sendOrder', "hongwei");
  
  res.json(req.body.uid)
}


router.route('/add').post(addTransactions)
router.route('/get/:uid').post(getTransactions)
router.route('/sendEther').post(sendEtherToUser)
router.route('/test').post(test)

export default router
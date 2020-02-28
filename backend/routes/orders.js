import { Router } from 'express' 
import Order from '../models/order_model'

const router = Router()


const addOrder = async (req, res) => {

  try {
    const { uuid, duid, txnTime, status, txnid } = req.body

    const newOrder = new Order({uuid, duid, txnTime, status, txnid})

    const result = await (await newOrder.save()).populate(['uuid', 'duid', 'txnid']).execPopulate()

    if(result) {
      //通知司機有訂單
      io.to(duid).emit('sendOrder', result);
    }

    res.json({status: true, result})

  } catch (error) {
    
    res.json({
      status: false,
      msg: error.toString()
    })
  }

  
}

const getOrder = async (req, res) => {

  try {
    const { uid, population } = req.body
    const { type } = req.params

    let conditions = {}
    switch(type) {
      case "sender":
        conditions.uuid = uid;
        break;
      case "driver":
        conditions.duid = uid;
        break;
      case "all":
        conditions.uuid = uid[0];
        conditions.duid = uid[1];
    }

    const orders = await Order.find(conditions).populate(population).exec()

    res.json(orders)

  } catch (error) {
    
    res.json('Fail!')
    
  }
  
}

const updateOrderStatus = async (req, res) => {
  const { orderId, status, who, event } = req.body

  let triggerData = {}

  const orderDoc = await Order.findByIdAndUpdate(orderId,{
    status: status
  }, {
    useFindAndModify: false,
    new: true
  }).populate(['uuid', 'duid', 'txnid']).exec()

  switch(who) {
    case "sender":
      triggerData.client = orderDoc.duid._id
      triggerData.data = status == "completed" ? null : orderDoc
      break;
    case "driver":
      triggerData.client = orderDoc.uuid._id
      triggerData.data = orderDoc
      break;
  }

  if(orderDoc) {
    //通知使用者司機接取訂單
    io.to(triggerData.client).emit(event, triggerData.data);
    res.json(orderDoc)
  } else {
    res.json('Fail!')
  }
}


const test = async (req, res) => {
  io.to(req.body.uid[0]).emit('sendOrder', "hongwei");
  // io.to(req.body.uid[1]).emit('sendOrder');
}

router.route('/add').post(addOrder)
router.route('/get/:type').post(getOrder)
router.route('/updateStatus').post(updateOrderStatus)
router.route('/test').post(test)

export default router
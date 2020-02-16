import { Router } from 'express' 
import Order from '../models/order_model'

const router = Router()


const addOrder = async (req, res) => {

  try {
    const { uuid, duid, txnTime, status, } = req.body

    const newOrder = new Order({uuid, duid, txnTime, status })

    const result = await (await newOrder.save()).populate('uuid').execPopulate()

    if(result) {
      const { uuid, txnTime } = result
      io.to(duid).emit('sendOrder', result);

      console.log(result)
    }

    res.json(result)
  } catch (error) {
    
    res.json('Fail!')
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

    console.log(conditions)

    const orders = await Order.find(conditions).populate(population).exec()

    res.json(orders)

  } catch (error) {
    
    res.json('Fail!')
    
  }
  
}


const test = async (req, res) => {
  io.to(req.body.uid[0]).emit('sendOrder', "hongwei");
  // io.to(req.body.uid[1]).emit('sendOrder');
}

router.route('/add').post(addOrder)
router.route('/get/:type').post(getOrder)
router.route('/test').post(test)

export default router
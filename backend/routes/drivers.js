import { Router } from 'express'
import Driver from '../models/driver_model'

const router = Router()


const get_all_driver = async (req, res) => {
  const drivers = await Driver.find()
  res.json(drivers)
}

const get_drivers_data = async (req, res) => {
  const query = Driver.find().populate('uid')
  query.exec((error, drivers) => {
    res.json(drivers)
  })
}

const add_driver = async (req, res) => {
  const { body } = req

  try {
    const newDriver = new Driver(body)

    await newDriver.save()

    res.json('Driver added!')
  } catch (error) {

    Promise.reject(error)
    res.json('Driver add fail!')
  }
}


router.route('/').get(get_all_driver);
router.route('/add').post(add_driver);
router.route('/getDrivers').post(get_drivers_data);



export default router;
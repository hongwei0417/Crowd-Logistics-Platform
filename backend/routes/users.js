import { Router } from 'express'
import User from '../models/user_model'

const router = Router()


const get_all_user = async (req, res) => {
  const users = await User.find()
  res.json(users)
}

const add_user = async (req, res) => {
  const { username, sex, birthday, phone_number, email, cid, psd, psd_hint } = req.body;
  
  try {
    const newUser = new User({
      username,
      sex,
      birthday,
      phone_number,
      email,
      cid,
      psd,
      psd_hint
    });
  
    await newUser.save()
  
    res.json('User added!')

  } catch(e) {
    console.log(e)
  }
  
}

const update_user = async (req, res) => {
  const { body } = req

  if(req.params.id) {
    try {
      const result = await User.updateOne({_id: req.params.id}, body)
      console.log(result.n)
      console.log(result.nModified)

      res.json(req.params.id + " has updated")
  
    } catch(e) {
      console.log(e);
      Promise.reject(e)
    }
  } else {
    Promise.reject("no id")
  }

}

const verify_login = async (req, res) => {
  const { email, password } = req.body
  const query = User.findOne({email: email})
  query.exec((error, user) => {

    if(error) {
      console.log(error)
      res.json(error)
      return
    }

    if(user) {
      if(user.psd == password) {
        res.json(true)
      } else {
        res.json(false)
      }
    } else {
      res.json({status: false, msg: 'No user'})
    }
    
  })
}


const check_email = async (req, res) => {
  const query = User.find({email: req.body.email})

  query.exec((error, users) => {
    if(error) {
      console.log(error)
      res.json(error)
    } else {
      if(users.length) {
        res.json(false)
      } else {
        res.json(true)
      }
    }
  })
}


const register = async (req, res) => {
  const { email, password, username, phone_number } = req.body

  console.log(username)

  const query = User.find({email: email})

  query.exec(async (error, users) => {
    if(error) {
      console.log(error)
      res.json(error)
      return
    }

    if(users.length) {
      res.json({status: false, msg: 'User exists'})
    } else {
      const newUser = new User({
        username,
        phone_number,
        email,
        psd: password,
      });

      await newUser.save()

      res.json(true)
    }
  })
}


router.route('/').get(get_all_user);
router.route('/add').post(add_user);
router.route('/update/:id').post(update_user);
router.route('/login').post(verify_login);
router.route('/check_email').post(check_email);
router.route('/register').post(register);


export default router;
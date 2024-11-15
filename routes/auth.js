// import ....
const express = require('express')
const router = express.Router()

// import controller
// const { register, login, curentUser, curentAdmin } = require('../controllers/auth')

const { register, login } = require('../controllers/auth')


router.post('/register', register)
router.post('/login', login)

// import Middleware
// const { authCheck, adminCheck } = require('../middlewares/authCheck')


// router.post('/register', register)
// router.post('/login', login)
// router.post('/current-user', curentUser)
// router.post('/current-admin', curentUser)





module.exports = router
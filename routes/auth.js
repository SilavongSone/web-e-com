// import ....
const express = require('express')
const router = express.Router()

// import controller


const { register, login, currentUser } = require('../controllers/auth')


router.post('/register', register)
router.post('/login', login)
router.post('/current-user', currentUser)
router.post('/current-admin', currentUser)

// import Middleware
// const { authCheck, adminCheck } = require('../middlewares/authCheck')





module.exports = router
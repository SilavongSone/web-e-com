const express = require('express')
const router = express.Router()


// @ENDPOINT http:/localhost:5000/api/category
router.get('/category',(req, res)=>{
    res.send('Hello Category')
})


const { category } = require('../controllers/category')


router.post('/category', category)



module.exports = router
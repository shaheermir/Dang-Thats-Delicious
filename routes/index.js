const express = require('express')
const storeController = require('../controllers/storeController')

const router = express.Router()

router.get('/', storeController.homePage)
router.get('/add', storeController.addStore)

module.exports = router

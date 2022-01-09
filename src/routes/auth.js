const router = require('express').Router()
const authController = require('../controllers/auth.js')

router.post('/login', authController.LOGIN)
router.post('/register', authController.REGISTER)

module.exports = router
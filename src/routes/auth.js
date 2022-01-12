const router = require('express').Router()
const authController = require('../controllers/auth.js')
const {regValidation} = require('../middlewares/validation.js')

router.post('/login', authController.LOGIN)
router.post('/register', regValidation, authController.REGISTER)

module.exports = router
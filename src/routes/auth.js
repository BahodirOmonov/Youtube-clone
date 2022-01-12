const router = require('express').Router()
const authController = require('../controllers/auth.js')
const {regValidation} = require('../middlewares/validation.js')
const multer = require('multer')
const imageUpload = multer()

router.post('/login', authController.LOGIN)
router.post('/register', regValidation, imageUpload.single("image"), authController.REGISTER)

module.exports = router
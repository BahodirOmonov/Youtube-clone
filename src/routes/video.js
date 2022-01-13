const router = require('express').Router()
const multer = require('multer')
const videoController = require('../controllers/video.js')
const tokenMiddleware = require('../middlewares/checkToken.js')
const videoUpload = multer()


router.get('/', videoController.GET)
router.get('/:videoId', videoController.GET)
router.get('/download/videos/:videoUrl', videoController.DOWNLOAD)
router.post('/', tokenMiddleware, videoUpload.single('video'), videoController.POST)
router.put('/', tokenMiddleware, videoController.PUT)
router.delete('/', tokenMiddleware, videoController.DELETE)

module.exports = router
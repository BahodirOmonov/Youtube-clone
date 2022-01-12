const router = require('express').Router()
const videoController = require('../controllers/video.js')


router.get('/', videoController.GET)
router.get('/:videoId', videoController.GET)
router.post('/', videoController.POST)
router.put('/', videoController.PUT)
router.delete('/', videoController.DELETE)

module.exports = router
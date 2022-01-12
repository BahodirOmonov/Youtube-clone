const fs = require('fs')
const path = require('path')

const GET = (req, res, next) => {
	try	{
		const {PAGINATION} = require('../../config.js')

		const { videoId } = req.params
		const { page = PAGINATION.page, limit = PAGINATION.limit, search, userId } = req.query

		let videos = req.select('videos')

		if(videoId) {
			return res.json(videos.find(video => video.videoId == videoId))
		}

		videos = videos.slice(page * limit - limit, page * limit)

		videos = videos.filter(video => {
			let userFilter = userId ? video.userId == userId : true
			let searchFilter = search ? video.videoTitle.toLowerCase().includes(search.trim().toLowerCase()) : true
			return userFilter && searchFilter
		})

		return res.json(videos)


	} catch(error) {
		return next(error)
	}
}

const POST = (req, res, next) => {
	try	{
		const {videoTitle} = req.body

		if(!videoTitle) {
			throw new Error("videoTitle'ga qiymat kiriting!")
		}

		if(!req.file) {
			throw new Error("Video mavjud emas!")
		}

		const {originalname, mimetype, buffer, size} = req.file

		if(size > (200 * 1024 * 1024)) {
			throw new Error("Video hajmi 200MB dan kichik bo'lishi kerak!")
		}

		if(mimetype != 'video/mp4') {
			throw new Error("Video faqat mp4 bo'lishi kerak!")
		}

		const videos = req.select("videos")

		const videoName = Date.now() + originalname.replace(/\s/g, "")

		const newVideo = {
			videoId: videos.length ? videos[videos.length - 1].videoId + 1: 1,
			userId: req.userId,
			videoTitle: videoName,
			videoUrl: '/videos/' + videoName,
			videoSize: Math.ceil(size / 1024 / 1024),
			videoDate: new Date()
		}

		videos.push(newVideo)

		req.insert("videos", videos)

		fs.writeFileSync(path.join(process.cwd(), 'files', 'videos', videoName), buffer)

		res.status(201).json({
			message: "Video muvaffaqiyatli yozildi!",
			video: newVideo
		})
		
	} catch(error) {
		return next(error)
	}
}

const PUT = (req, res, next) => {
	try	{
		//...
		
	} catch(error) {
		return next(error)
	}
}

const DELETE = (req, res, next) => {
	try	{
		//...
		
	} catch(error) {
		return next(error)
	}
}


module.exports = {
	GET,
	POST,
	PUT,
	DELETE
}

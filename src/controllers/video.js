const fs = require('fs')
const path = require('path')

const GET = (req, res, next) => {
	try	{
		const {PAGINATION} = require('../../config.js')

		const { videoId } = req.params
		const { page = PAGINATION.page, limit = PAGINATION.limit, search, userId } = req.query

		let videos = req.select('videos')
		let users = req.select('users')

		if(videoId) {
			return res.json(videos.find(video => {
				if(video.videoId == videoId) {
					video.user = users.find(user => user.userId == video.userId)
					video.user ? delete video.user.password : video.user
					return video.user
				}
				return false
			}))
		}

		videos = videos.filter(video => {
			let userFilter = userId ? video.userId == userId : true
			let searchFilter = search ? video.videoTitle.toLowerCase().includes(search.trim().toLowerCase()) : true
			return userFilter && searchFilter
		})

		videos = videos.slice(page * limit - limit, page * limit)
		videos = videos.filter(video => {
			video.user = users.find(user => user.userId == video.userId)
			video.user ? delete video.user.password : video.user
			return video.user 
		})

		return res.json(videos)


	} catch(error) {
		return next(error)
	}
}

const POST = (req, res, next) => {
	try	{
		const {videoTitle} = req.body
		const agent = req.headers['user-agent']

		if(!videoTitle) {
			throw new Error("videoTitle'ga qiymat kiriting!")
		}

		if(!req.file) {
			throw new Error("Video mavjud emas!")
		}

		if(agent != req.agent) {
			throw new Error("Qaytadan login qiling!")
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
			videoTitle,
			videoUrl: '/videos/' + videoName,
			videoSize: Math.ceil(size / 1024 / 1024),
			videoDate: new Date()
		}

		videos.push(newVideo)

		fs.writeFileSync(path.join(process.cwd(), 'files', 'videos', videoName), buffer)

		req.insert("videos", videos)

		return res.status(201).json({
			message: "Video muvaffaqiyatli yozildi!",
			video: newVideo
		})
		
	} catch(error) {
		return next(error)
	}
}

const PUT = (req, res, next) => {
	try	{
		const { videoTitle, videoId } = req.body
		const agent = req.headers['user-agent']

		if(!videoTitle || !videoId) {
			throw new Error("videoTitle yoki videoId kiritilmagan!")
		}

		if(videoTitle.length > 50) {
			throw new Error("videoTitle uzunligi 50 ta belgidan kichik bo'lishi kerak!")
		}

		if(agent != req.agent) {
			throw new Error("Qaytadan login qiling!")
		}

		const videos = req.select('videos')

		const found = videos.find(video => video.videoId == videoId && video.userId == req.userId)

		if(!found) {
			throw new Error("Video topilmadi!")
		}

		found.videoTitle = videoTitle

		req.insert('videos', videos)

		return res.status(201).json({
			message: "Video title o'zgartirildi!",
			video: found
		})
		
	} catch(error) {
		return next(error)
	}
}

const DELETE = (req, res, next) => {
	try	{
		const { videoId } = req.body
		const agent = req.headers['user-agent']

		if(!videoId) {
			throw new Error("videoId kiritilmagan!")
		}

		if(agent != req.agent) {
			throw new Error("Qaytadan login qiling!")
		}

		const videos = req.select('videos')

		const foundIndex = videos.findIndex(video => video.videoId == videoId && video.userId == req.userId)

		if(foundIndex == -1) {
			throw new Error("Video topilmadi!")
		}

		[ deletedVideo ] = videos.splice(foundIndex, 1)

		fs.unlinkSync(path.join(process.cwd(), 'files', deletedVideo.videoUrl))

		req.insert('videos', videos)


		return res.status(201).json({
			message: "Video o'chirildi!",
			video: deletedVideo
		})
		
	} catch(error) {
		return next(error)
	}
}

const DOWNLOAD = (req, res, next) => {
	try {
		const { videoUrl } = req.params
		return res.download(path.join(process.cwd(), 'files', "videos", videoUrl))

	} catch(error) {
		return next(error)
	}
}


module.exports = {
	GET,
	POST,
	PUT,
	DELETE,
	DOWNLOAD
}

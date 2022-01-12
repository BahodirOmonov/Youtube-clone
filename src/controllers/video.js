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
		//...
		
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

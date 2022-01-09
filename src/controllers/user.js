const GET = (req, res, next) => {
	const {PAGINATION} = require('../../config.js')

	const {userId} = req.params
	const {page = PAGINATION.page, limit = PAGINATION.limit} = req.query

	let users = req.select('users')

	if(userId) {
		const userFind = users.find(user => user.userId == userId)
		return res.json(user)
	}
	else { 
		users = users.slice(page * limit - limit, page * limit)
		return res.json(users)
	}
}



module.exports = {
	GET
}
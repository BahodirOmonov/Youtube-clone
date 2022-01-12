const { verify } = require('../utils/jwt.js')

module.exports = (req, res, next) => {
	try {
		const { token } = req.headers

		if(!token) {
			throw new Error("Siz ro'yxatdan o'tmagansiz!")
		}

		const { userId, agent } = verify(token)

		req.userId = userId
		req.agent = agent
		
		return next()

	} catch(error) {
		return next(error)
	}


}
const sha256 = require('sha256')
const jwt = require('../utils/jwt.js')


const LOGIN = (req, res, next) => {
	try {
		const {username, password} = req.body

		if(!username || !password) throw new Error("username or password required!")

		const users = req.select('users')

		const user = users.find(user => user.username == username && user.password == sha256(password))

		delete user.password

		if(user) {
			return res.status(201).json({
				message: "The user logged!",
				user,
				token: jwt.sign({userId: user.userId, agent: req.headers['user-agent']})
			})
		}

		return res.status(401).json({
			message: "Wrong username or password!"
		})

	} catch(error) {
		return next(error)
	}
}
const REGISTER = (req, res, next) => {
	try {

	} catch(error) {
		return next(error)
	}
}

module.exports = {
	LOGIN,
	REGISTER
}
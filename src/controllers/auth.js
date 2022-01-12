const sha256 = require('sha256')
const jwt = require('../utils/jwt.js')
const path = require('path')
const fs = require('fs')


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

		if(!req.file) {
			throw new Error("Rasm mavjud emas!")
		}

		const {originalname, mimetype, buffer, size} = req.file
		const {username, password} = req.body

		if (!(/[!@#$%^&*]/).test(password)) {
			throw new Error("Password'da maxsus belgilardan foydalaning!")
		}

		if(size > (5 * 1024 * 1024)) {
			throw new Error("Rasm hajmi 5MB dan kichik bo'lishi kerak!")
		}

		if(!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) {
			throw new Error("Rasm faqat png yoki jpeg bo'lishi kerak!")
		}

		const users = req.select("users")

		const found = users.find(user => user.username == username)

		if(found) {
			throw new Error("Bu username band qilingan!")
		}

		const fileName = Date.now() + originalname.replace(/\s/g, "")

		const newUser = {
			userId: users.length ? users[users.length - 1].userId + 1: 1,
			username,
			password: sha256(password),
			userUrl: '/image/' + fileName
		}

		users.push(newUser)

		req.insert("users", users)

		fs.writeFileSync(path.join(process.cwd(), 'files', 'images', fileName), buffer)

		delete newUser.password

		res.status(201).json({
			message: "Muvaffaqiyatli ro'yxatdan o'tildi!",
			user: newUser,
			token: jwt.sign({userId: newUser.userId, agent: req.headers['user-agent']})
		})

	} catch(error) {
		return next(error)
	}
}

module.exports = {
	LOGIN,
	REGISTER
}

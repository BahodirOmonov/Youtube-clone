const dotenv = require('dotenv')
const PORT = process.env.PORT || 5000

dotenv.config()

const TOKEN_TIME = 86400

const PAGINATION = {
	page: 1,
	limit: 10
}


module.exports = {
	PORT,
	PAGINATION,
	TOKEN_TIME
}
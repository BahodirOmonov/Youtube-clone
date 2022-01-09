const fs = require('fs')
const path = require('path')

module.exports = (req, res, next) => {
	req.select = (fileName) => {
		let files = fs.readFileSync(path.join(__dirname, "../database", fileName + ".json"), 'UTF-8')
		files = files ? JSON.parse(files): []
		return files
	}

	req.insert = (fileName, data) => {
		fs.writeFileSync(path.join(__dirname, "../database", fileName + ".json"), JSON.stringify(data, null, 4))
		return true
	}

	return next()
}




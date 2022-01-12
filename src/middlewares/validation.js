const joi = require('joi')

const userValidation = joi.object({
	username: joi.string().max(30).alphanum().required(),
	password: joi.string().min(5).max(15).required()
})


const regValidation = (req, res, next) => {
	const {error, value} = userValidation.validate(req.body)

	if(error) {
		return next(error)
	}
	
	return next()
}

module.exports = {
	regValidation
}
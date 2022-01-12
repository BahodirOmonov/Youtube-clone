const express = require('express')
const {PORT} = require('../config.js')
const app = express()

const modelMiddleware = require('./middlewares/model.js')

app.use(express.json())
app.use(modelMiddleware)

const userRouter = require('./routes/user.js')
const authRouter = require('./routes/auth.js')
const videoRouter = require('./routes/video.js')

app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/videos', videoRouter)


app.use((error, req, res, next) => {
	return res.send({message: error.message})
})

app.listen(PORT, () => console.log("Server is running on http://localhost:" + PORT))
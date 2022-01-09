const express = require('express')
const {PORT} = require('../config.js')
const app = express()

const modelMiddleware = require('./middlewares/model.js')

app.use(modelMiddleware)


const userRouter = require('./routes/user.js')

app.use('/users', userRouter)

app.listen(PORT, () => console.log("Server is running on http://localhost:" + PORT))
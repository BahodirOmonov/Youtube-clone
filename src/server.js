const express = require('express')
const {PORT} = require('../config.js')
const app = express()


app.listen(PORT, () => console.log("Server is running on http://localhost:" + PORT))
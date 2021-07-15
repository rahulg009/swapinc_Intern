require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const imageRouter = require('./routers/image')


const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.use(express.json())
app.use(imageRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
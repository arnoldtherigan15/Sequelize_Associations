const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const router = require('./router')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)

app.listen(PORT,_=>{console.log(`listening on PORT ${PORT}`)})
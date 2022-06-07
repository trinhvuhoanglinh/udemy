const express = require('express')
const cors = require('cors')
const connection = require("./mysql")
console.log(connection)
const bodyParser = require('body-parser');
const auth = require('./controller/auth')

const app = express()
const port = 3001



app.use(cors({ origin: "*" }))
app.use(bodyParser.json());


app.use('/', auth);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
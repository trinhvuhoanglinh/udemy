require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const auth = require('./controllers/auth/auth-controller');
const profile = require('./controllers/profile/profile-controller');
const config = require('./config');

const app = express()
const port = config.PORT;

app.use(cors({ origin: "*" }))
app.use(bodyParser.json());


app.use('/auth', auth);
app.use('/profile', profile);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
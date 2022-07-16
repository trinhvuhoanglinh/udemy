require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const auth = require('./controllers/auth/auth-controller');
const profile = require('./controllers/profile/profile-controller');
const payment = require('./controllers/payment/payment-controller');
const course = require('./controllers/course/course-controller');
const mycourse = require('./controllers/mycourse/mycourse-controller');
const config = require('./config');

const app = express()
const port = config.PORT;

app.use(cors())
app.use(bodyParser.json());


app.use('/auth', auth);
app.use('/profile', profile);
app.use('/payment', payment);
app.use('/course', course);
app.use('/mycourse', mycourse)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
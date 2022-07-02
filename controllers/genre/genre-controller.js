const express = require('express');
const { all } = require('./genre-service');

const router = express.Router();

router.get('/all', all);

module.exports = router

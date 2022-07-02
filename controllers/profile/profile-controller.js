const express = require('express');
const { authMiddleware } = require('../../middlewares/auth-middleware');
const { getUserInfo, editProfile, changePassword, setPaypalId } = require('./profile-service');
const router = express.Router();


router.use(authMiddleware);
router.get('/getInfo', getUserInfo);
router.post('/editProfile', editProfile);
router.post('/changePassword', changePassword);
router.post('/setPaypalID', setPaypalId);

module.exports = router

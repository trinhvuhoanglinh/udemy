const express = require('express');
const { authMiddleware } = require('../../middlewares/auth-middleware');
const { getPayment, deposit, deletePayment, withdraw } = require('./payment-service');
const router = express.Router();


router.use(authMiddleware);
router.get('/getPayment', getPayment);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);

router.post('/deletePayment', deletePayment);



module.exports = router

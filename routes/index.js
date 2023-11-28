const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/forgot-password', homeController.forgotPassword);
router.post('/verify-user', homeController.verifyUser);
router.get('/reset-password', homeController.resetPassword);
router.post('/reset-password', homeController.updatePassword);
router.use('/users', require('./users'));

module.exports = router;

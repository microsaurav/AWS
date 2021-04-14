const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/signup',UserController.user_signup);

router.post('/login',UserController.user_login);




module.exports = router;
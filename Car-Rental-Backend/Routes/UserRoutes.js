
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');  


router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/users', userController.userslist);

module.exports = router;

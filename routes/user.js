const express = require('express');
const router = express.Router();
const userController = require('../contollers/user');
const authenticateToken = require('../middleware/authorization');

router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);
router.get('/user', authenticateToken, userController.getUser);
router.put('/user', authenticateToken, userController.updateUser);

module.exports = router;

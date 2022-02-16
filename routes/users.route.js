const userController = require('../controller/user.controller');
const express = require('express');
const router = express.Router();


 router.post('/register', userController.register);



const auth = require('../authorization');
const { func } = require('joi');
router.post('/login', userController.login);

router.get('/self', userController.self);

router.put('/self', userController.update);

module.exports = router;
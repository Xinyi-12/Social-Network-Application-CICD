const userController = require('../controller/user.controller');
const express = require('express');
const router = express.Router();

//create a user 
 router.post('/', userController.register);



const auth = require('../authorization');
const { func } = require('joi');
router.post('/login', userController.login);

router.get('/self', userController.self);

router.put('/self', userController.update);

router.get("/", userController.health);


module.exports = router;
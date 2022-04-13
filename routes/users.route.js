const userController = require('../controller/user.controller');
const express = require('express');
const router = express.Router();
const multer = require('multer');

//create a user 
 router.post('/new02', userController.register);



const auth = require('../authorization');
const { func } = require('joi');
router.post('/login', userController.login);

router.get('/self', userController.self);

router.put('/self', userController.update);



router.post('/self/pic', multer({dest: 'file'}).single('file'), userController.addorUpdateProfilePic);
router.get('/self/pic', userController.getProfilePic);
router.delete('/self/pic', userController.deleteProfilePic);


router.get("/", userController.health);

router.post('/verifyUserEmail', userController.verifyUserEmail);
module.exports = router;

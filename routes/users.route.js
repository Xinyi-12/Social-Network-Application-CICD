const userController = require('../controller/user.controller');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const multer = require('multer');

//create a user 
function statsd (path) {
    return function (req, res, next) {
      var method = req.method || 'unknown_method';
      req.statsdKey = ['http', method.toLowerCase(), path].join('.');
      next();
    };
  }
 router.post('/new02', statsd ("createuser"),userController.register);


const auth = require('../authorization');
const { func } = require('joi');
router.post('/login', userController.login);

router.get('/self',jsonParser, userController.self);

router.put('/self', userController.update);



router.post('/self/pic', multer({dest: 'file'}).single('file'), userController.addorUpdateProfilePic);
router.get('/self/pic', userController.getProfilePic);
router.delete('/self/pic', userController.deleteProfilePic);


router.get("/", userController.health);

router.post('/verifyUserEmail', userController.verifyUserEmail);
module.exports = router;

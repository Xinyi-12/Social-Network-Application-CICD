const jwt = require('jsonwebtoken');
const app = require('..');
const userService = require('../service/user.service');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../authorization');
const decode = require('jwt-decode');

// app.use(expressJWT(secretKey));

exports.register = (req, res, next) => {

    //validation area

    //const bcryptpass = bcryptjs.hashSync(req.body.password, 10)
    const data = {
        userinfo : req.body,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password
    };

    //bcrypt.hashSync(req.body.password, 10)
    console.log(data.password);
     
    userService.register(data, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }

        // const tokenStr = jwt.sign({ username: data.firstName}, secretKey, {expiresIn:'30s'});
        
        return res.status(200).send({
            status: 200,
            success: 1,
            data: result,
            // token: tokenStr
        })
    })
};

exports.login = (req, res, next) => {
    //validation area

    const data = {
        emailId: req.body.emailId,
        password: req.body.password
    };

    console.log("controller----" + req.body.emailId + " " + req.body.password);

    userService.login(data, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }
        return res.status(200).send({
            status: 200,
            success: 1,
            data: result
        })
    })
};

exports.self = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const code = jwt.decode(token)

    const data = {
       emailId: code.emailId
    };

    // console.log(req.);
    userService.self(data, (error, results)=> {
        if(error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }
        return res.status(200).send({
            status:200,
            success:1,
            data: results
        })
    });
}
 
exports.update = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const code = jwt.decode(token)

    console.log("update-"+token)
    const data = {
        userinfo : req.body,
        emailId: code.emailId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        id: req.query.id,
        account_created : req.body.account_created
    };

    console.log(data.account_created);

    
    userService.updateUser(data, (error, result) => {

        

        if(error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }
        return res.status(200).send({
            status:200,
            success:1,
            data: result
        })
    });
}
const userService = require('../service/user.service');

exports.register = (req, res, next) => {
    //validation area
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password
    };

    userService.register(data, (error, result) => {
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

exports.login = (req, res, next) => {
    //validation area
    const data = {
        emailId: req.body.emailId,
        password: req.body.password
    };

    userService.register(data, (error, result) => {
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
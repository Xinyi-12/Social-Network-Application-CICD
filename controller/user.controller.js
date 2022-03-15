const jwt = require('jsonwebtoken');
const app = require('..');
const userService = require('../service/user.service');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../authorization');
const decode = require('jwt-decode');
// const uuid = require('uuid');
const uuid = require('node-uuid');
const { uploadFile } = require('../s3');
const db = require('../config/db.config');



// app.use(expressJWT(secretKey));

exports.health = (req, res, next) => {
    res.status(200).send({
        status: 200,

    })

    res.status(404).send({
        status: 404

    })

}

exports.register = (req, res, next) => {

    //validation area

    //const bcryptpass = bcryptjs.hashSync(req.body.password, 10)
    const data = {
        userinfo: req.body,
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


    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');//[emailId, password]

    const data = {
        emailId: email,
        password: password
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

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');//[emailId, password]

    const data = {
        emailId: email,
        password: password
    };

    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {

            if (error) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            console.log("=== " + data.password + " : " + results[0].password);
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log(compareResult);
            // compareResult = true;
            console.log(results);

            if (results.length > 0 && compareResult) {
                return;
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        }
    )

    userService.self(data, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(401).send({
                status: 401,
                success: 0,
                data: 'bad request'
            });

        }
        return res.status(200).send({
            data: results
        })
    });

}

exports.update = (req, res, next) => {

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');//[emailId, password]

    const data = {
        emailId: email,
        password: password,
        userinfo: req.body,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        id: req.query.id,
        account_created: req.body.account_created,
    };

    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {

            if (error) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            console.log("=== " + data.password + " : " + results[0].password);
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log(compareResult);
            // compareResult = true;
            console.log(results);

            if (results.length > 0 && compareResult) {
                return;
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        }
    )

    var no = 0;
    for (var o in data.userinfo) {
        no++;
    }

    if (no > 3) {
        return res.status(400).send({
            status: 400,
            success: 0,
            data: 'bad request'
        });
    }

    userService.updateUser(data, (error, result) => {

        if (error) {
            console.log(error);
            return res.status(400).send({
                status: 400,
                success: 0,
                data: 'bad request'
            });
        }
        return res.status(200).send({
            data: result
        })
    });
}


exports.addorUpdateProfilePic = async (req, res, next) => {

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');//[emailId, password]

    const data = {
        emailId: email,
        password: password,
        fileName: req.file.originalname,
        url: req.file.path

    };

    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {

            if (error) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            // console.log("=== " + data.password + " : " + results[0].password);
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log(compareResult);
            // compareResult = true;
            console.log(results);

            if (results.length > 0 && compareResult) {
                return;
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        }
    )

    db.query(
        `SELECT id FROM users where emailId = ?`,
        [data.emailId],
        (error, results, fields) => {
            console.log("------------")
            console.log(results[0].id);
            data.addedByUserId = results[0].id
        }
    )

    const file = req.file;
    console.log(file);

    const result = await uploadFile(file);
    console.log(result);

    setTimeout(function () {
        userService.addorUpdateProfilePic(data, (error, result) => {

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
    }, 1000);
}

exports.getProfilePic = (req, res, next) => {

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');//[emailId, password]

    const data = {
        emailId: email,
        password: password,

    };


    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {

            if (error) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log("--" + compareResult);
            console.log(results);

            if (results.length > 0 && compareResult) {
                return;
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        }
    )



    db.query(
        `SELECT id FROM users where emailId = ?`,
        [data.emailId],
        (error, results, fields) => {
            console.log("------------")
            console.log(results[0].id);
            data.userId = results[0].id;
        }
    )


    setTimeout(function () {
        userService.getProfilePic(data, (error, result) => {


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
    }, 1000);

}


exports.deleteProfilePic = (req, res, next) => {

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');//[emailId, password]

    const data = {
        emailId: email,
        password: password,

    };


    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {

            if (error) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log("--" + compareResult);
            console.log(results);

            if (results.length > 0 && compareResult) {
                return;
            } else {
                return res.status(403).send({ message: 'Forbidden' });
            }
        }
    )



    db.query(
        `SELECT id FROM users where emailId = ?`,
        [data.emailId],
        (error, results, fields) => {
            console.log("------------")
            console.log(results[0].id);
            data.userId = results[0].id;
        }
    )


    setTimeout(function () {
        userService.deleteProfilePic(data, (error, result) => {


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
    }, 1000);

}

// {
//     "file_name": "image.jpg",
//     "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
//     "url": "bucket-name/user-id/image-file.extension",
//     "upload_date": "2020-01-12",
//     "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"
//   }
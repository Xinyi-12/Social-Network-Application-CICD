const jwt = require('jsonwebtoken');
const app = require('..');
const userService = require('../service/user.service');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../authorization');
const decode = require('jwt-decode');
const { uploadFile } = require('../s3');
const db = require('../config/db.config');
const { v4: uuid } = require('uuid');
const { v4 } = require('node-uuid');
const TokenGenerator = require('uuid-token-generator');
const log4js = require('log4js'); // include log4js

var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-1'
});

var docClient = new AWS.DynamoDB.DocumentClient()

const SESConfig = {
    apiVersion: "2010-12-01",
    accessKeyId: "AKIA2EQZ22PO56Q33A37",
    accessSecretKey: "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",
    region: "us-east-1"
}
AWS.config.update(SESConfig);

log4js.configure({
    appenders: { 'file': { type: 'file', filename: 'record.log' } },
    categories: { default: { appenders: ['file'], level: 'debug' } }
  });
let healthzCount = 0;
let registerCount = 0;
let updateuserCount = 0;
let uploadPictureCount = 0;
let deleteUserPicCout = 0;
let selfCount = 0;

exports.health = (req, res, next) => {
    healthzCount++;

    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("health, the " + healthzCount + " times request");
    console.log("the " + healthzCount + " times request")

    res.status(200).send({
        status: 200,

    })

    res.status(404).send({
        status: 404

    })


}

exports.register =  (req, res, next) => {
    registerCount++;
    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("register, the " + registerCount + " times request");
    console.log("the " + registerCount + " times request")

    // try {
        //validation area

        //const bcryptpass = bcryptjs.hashSync(req.body.password, 10)
        const data = {
            userinfo: req.body,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: req.body.password
        };
        const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);

        const uuid = tokgen.generate();
      
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
    selfCount++;
    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("GET self,the " + selfCount + " times request");
    console.log("the " + selfCount + " times request")

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).send({ message: 'Forbidden' });
    }


    console.log("0000"+authorization);

    const encoded = authorization.substring(6);
    console.log(encoded);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    console.log(decoded)
    const [email, password] = decoded.split(':');//[emailId, password]


    const data = {
        emailId: email,
        password: password
    };

    console.log(data.emailId);

    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {
            console.log(results);

            if (error) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            console.log("--"+data.password);
            console.log("**" + results[0].password)
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
    updateuserCount++;
    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("Update user, the " + updateuserCount + " times request");
    console.log("the " + updateuserCount + " times request")

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
    uploadPictureCount++;
    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("addorUpdateProfilePic, the " + uploadPictureCount + " times request");
    console.log("the " + uploadPictureCount + " times request")

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
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log(compareResult);
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
    getPictureCount++;
    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("getProfilePic, the " + getPictureCount + " times request");
    console.log("the " + getPictureCount + " times request")


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
    deleteUserPicCout
    var loggerinfo = log4js.getLogger('record'); // initialize the var to use.
    loggerinfo.info("deleteProfilePic,the " + deleteUserPicCout + " times request");
    console.log("the " + deleteUserPicCout + " times request")

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













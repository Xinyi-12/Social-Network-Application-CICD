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
    appenders: { 'file': { type: 'file', filename: 'logs/info.log' } },
    categories: { default: { appenders: ['file'], level: 'debug' } }
  });
let healthzCount = 0;

exports.health = (req, res, next) => {
    healthzCount++;

    var loggerinfo = log4js.getLogger('info'); // initialize the var to use.
    loggerinfo.info("the " + healthzCount + " times request");

    res.status(200).send({
        status: 200,

    })

    res.status(404).send({
        status: 404

    })


}

exports.register = async (req, res, next) => {

    try {
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
        const character = {

            username: req.body.emailId,
            token: uuid,
            ttl: Math.floor(Date.now() / 1000) + 2 * 60

        }
        console.log(character)

        const dyParams = {
            TableName: 'csye6225',
            Item: character
        }

        await docClient.put(dyParams).promise();


        const params = {
            //Protocol:'lambda',
            Message: req.body.emailId + ',' + uuid,
            TopicArn: 'arn:aws:sns:us-east-1:696912630749:verification',
            //Endpoint:'arn:aws:lambda:us-east-1:444584272403:function:testlambda'
        }
        console.log(params);

        await new AWS.SNS({
            apiVersion: '2010-03-31'
        }).publish(params).promise();

        console.log("sns.......");

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

    } catch (err) {
        res.status(500).json(err)
    }

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


    // console.log("0000"+authorization);

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


// export const create = async (req, res) => {
//     if (!req.body.emailId || !req.body.password || !req.body.firstName || !req.body.lastName) {
//         res.status(400).send({
//             message: "Input can not be empty!"
//         });
//         return;
//     }


//     var expires = new Date();
//     // expires.setTime(expires.getTime()+60*2*1000)
//     const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
//     let isEmail = regEmail.test(req.body.emailId);
//     if (!isEmail) {
//         res.status(400).json(
//             "Username must be an email!"
//         );
//         return;
//     }


//     try {
//         const userExist = await userDB.findOne({
//             attributes: {
//                 exclude: ['password']
//             },
//             where: {
//                 username: req.body.username
//             }
//         })
//         const uuid = v4();
//         if (userExist != null && userExist.verify == true) {
//             res.status(400).json("Username has been used");
//             return
//         }
//         if (userExist != null && userExist.verify == false) {

//             var param = {
//                 TableName: 'csye6225',
//                 Key: {
//                     'username': {
//                         S: userExist.username
//                     }
//                 }
//             };

//             ddb.getItem(param, (err, data) => {


//                 console.log(data.Item)
//                 if (data.Item === undefined) {

//                     const character = {

//                         username: req.body.username,
//                         token: uuid,
//                         ttl: Math.floor(Date.now() / 1000) + 2 * 60

//                     }
//                     const dyParams = {
//                         TableName: tableName,
//                         Item: character
//                     }

//                     docClient.put(dyParams).promise()



//                     const params = {

//                         Message: req.body.username + ',' + uuid,
//                         TopicArn: 'arn:aws:sns:us-east-1:971613862138:verification',

//                     }


//                     new AWS.SNS({
//                         apiVersion: '2010-03-31'
//                     }).publish(params).promise();
//                     res.status(200).json("Please check your email to verify!");
//                     return;

//                 } else {

//                     res.status(400).json("Please login in your email to verify your account!");
//                     return;
//                 }
//             }

//             )
//             return;
//         }

//         //Generate an encrypted password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);


//         const user = {
//             username: req.body.username,
//             password: hashedPassword,
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             verify: false
//         };

//         const character = {

//             username: req.body.username,
//             token: uuid,
//             ttl: Math.floor(Date.now() / 1000) + 2 * 60

//         }
//         console.log(character)
//         const dyParams = {
//             TableName: tableName,
//             Item: character
//         }

//         await docClient.put(dyParams).promise()



//         const params = {
//             //Protocol:'lambda',
//             Message: req.body.username + ',' + uuid,
//             TopicArn: 'arn:aws:sns:us-east-1:971613862138:verification',
//             //Endpoint:'arn:aws:lambda:us-east-1:444584272403:function:testlambda'
//         }
//         console.log(params);

//         await new AWS.SNS({
//             apiVersion: '2010-03-31'
//         }).publish(params).promise();
//         await userDB.create(user)
//         res.status(200).json("Please check your email to verify!");
//     } catch (err) {
//         res.status(500).json(err)
//     }
// };


exports.verifyUserEmail = async (req, res) => {
    const token = req.query.token;
    const email = req.query.email;

    try {
        var params = {
            TableName: 'csye6225',
            Key: {
                'username': {
                    S: email
                }
            }
        };

        ddb.getItem(params, function (err, data) {
            if (data.Item === undefined) {
                res.status(400).json("The token has been expired!");
                return
            }
            if (data.Item.ttl.N < Math.floor(Date.now() / 1000)) {
                res.status(400).json("The token has been expired!");
                return
            }
            const dataEmail = data.Item.username.S
            const dataToken = data.Item.token.S


            console.log(dataEmail)
            console.log(dataToken)
            if (dataToken == token) {
                db.query(
                    `SELECT * FROM users where emailId = ?`,
                    [email],

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

                const user = {
                    verify: true

                };

                // userDB.update(user, {
                //     where: {
                //         username: email
                //     }
                // })
                res.status(200).json("User has been verified!");
            } else {
                res.status(200).json("Token does not match!");
                return;
            }

        })


    } catch (err) {
        res.status(500).json(err);
    }
};


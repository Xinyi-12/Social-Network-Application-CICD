const db = require('../config/db.config');
const jwt = require('jsonwebtoken');
const config = require('../config/token.config');
const { generateToken } = require('../authorization');
const bcrypt = require('bcryptjs');
const decode = require('jwt-decode');
const { self } = require('../controller/user.controller');

var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'us-east-1'
});

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var docClient = new AWS.DynamoDB.DocumentClient()

exports.register = (data, callback) => {
    //const bcryptpass = data.userinfo.password.
    console.log("register....")

    const bcryptpass = bcrypt.hashSync(data.userinfo.password);

    db.query(
        `INSERT INTO users(firstName, lastName, emailId, password, account_created,account_updated ) VALUES (?,?,?,?,?,?)`,
        [data.firstName, data.lastName, data.emailId, bcryptpass, new Date(),new Date()],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            console.log(new Date());

            var param = {
                TableName: 'csye6225',
                Key: {
                    'username': {
                        S: data.emailId
                    }
                }
            };

            ddb.getItem(param, (err, data) => {


                console.log(data.Item)
                if (data.Item === undefined) {

                    const character = {

                        username: req.body.emailId,
                        token: uuid,
                        ttl:Math.floor(Date.now() / 1000)+2*60

                    }
                    const dyParams = {
                        TableName: tableName,
                        Item: character
                    }

                    docClient.put(dyParams).promise()



                    const params = {

                        Message: req.body.emailId + ',' + uuid,
                        TopicArn: 'arn:aws:sns:us-east-1:696912630749:verification',

                    }


                    new AWS.SNS({
                        apiVersion: '2010-03-31'
                    }).publish(params).promise();
                    res.status(200).json("Please check your email to verify!");
                    return;

                } else {

                    res.status(400).json("Please login in your email to verify your account!");
                    return;
                }
            }
        )


            return callback(null, `Registration successful,Please check your email to verify!`);
        }
    );


};

exports.login = (data, callback) => {

    db.query(
        `SELECT * FROM users where emailId = ?`,
        [data.emailId],

        (error, results, fields) => {
              

            if (error) {
                return callback(error);
            }
            console.log("=== " + data.password + " : " + results[0].password);
            const compareResult = bcrypt.compareSync(data.password, results[0].password);
            console.log(compareResult);

            if (results.length > 0 && compareResult) {
                const token = generateToken({ emailId: data.emailId });
                console.log(token);
                return callback(null, token);
            } else {
                return callback("invalid token");
            }
        }
    );
};

exports.self = (data, callback) => {
    
    db.query(
        `select u.firstName, u.lastName, u.emailId , u.account_created , u.account_updated from users AS u where emailId = ?`,
        [data.emailId],
        (error, results, fields) => {
            console.log("==" + results);
            if (error) {
                return callback(error);
            }
            return callback(null, results);
        }
    );
}

exports.updateUser = (data, callback) => {

    const bcryptpass = bcrypt.hashSync(data.userinfo.password);

    db.query(

        `UPDATE users SET firstName = ?, lastName = ?, password=?, 
         account_updated =? where emailId = ?`,
        [data.firstName, data.lastName, bcryptpass ,new Date() , data.emailId],
        (error, results, fields) => {
     
            console.log(results);

            if (error) {
                return callback(error);
            }

            if (results.affectedRows === 1) {
                
                console.log(data.firstName);
                return callback(null, `update user info Successfully`);
            } else {
                return callback(new Error("Invalid user info"));
            }
        }

    )
}

exports.addorUpdateProfilePic = (data, callback) => {
    db.query(
        'INSERT INTO images (description, imagePath, datetimeCreated, addedByUserId) VALUEs (?,?,?,?)',
        [data.fileName, data.url, new Date(), data.addedByUserId],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, `add successful`);
        }

    );
}


exports.getProfilePic = (data, callback) => {

    db.query(

        `select * from images where addedByUserId = ?`,
        [data.userId],

        (error, results, fields) => {
            console.log("data-" + data.userId);
            if (error) {
                return callback(error);
            }
            console.log("-----")
            console.log(results)
            return callback(null, results);
        }

    );
}

exports.deleteProfilePic = (data, callback) => {

    db.query(

        `delete from images where addedByUserId = ?`,
        [data.userId],

        (error, results, fields) => {
            console.log("data-" + data.userId);
            if (error) {
                return callback(error);
            }
            console.log("-----")
            console.log(results)
            return callback(null, results);
        }

    );
}




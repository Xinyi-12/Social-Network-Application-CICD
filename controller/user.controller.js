const jwt = require('jsonwebtoken');
const app = require('..');
const userService = require('../service/user.service');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../authorization');
const decode = require('jwt-decode');
// const uuid = require('uuid');
const uuid = require('node-uuid');
const { uploadFile} = require('../s3');


// app.use(expressJWT(secretKey));

exports.health = (req, res, next) => {
    res.status(200).send({
        status: 200,
        a: 3
    
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
            status: 200,
            success: 1,
            data: results
        })
    });
}

exports.update = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const code = jwt.decode(token)

    console.log("update-" + token)
    const data = {
        userinfo: req.body,
        emailId: code.emailId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        id: req.query.id,
        account_created: req.body.account_created,
    };

    //update any other field should return 400 Bad Request HTTP response code.
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
            status: 200,
            success: 1,
            data: result
        })
    });
}


exports.addorUpdateProfilePic = async (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const code = jwt.decode(token)
    const key = `${code.emailId}/${uuid.v1()}.jpeg`;
    const file = req.file;
    console.log(file);

    const result = await uploadFile(file);
    console.log(result);

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
}

exports.getProfilePic = (req, res, next) => {
    res.status(200).send({
        status: 200
    
    })

    res.status(404).send({
        status: 404
    
    })

}

exports.deleteProfilePic = (req, res, next) => {
    res.status(200).send({
        status: 200,
        a: 3
    
    })

    res.status(404).send({
        status: 404
    
    })
}

// {
//     "file_name": "image.jpg",
//     "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
//     "url": "bucket-name/user-id/image-file.extension",
//     "upload_date": "2020-01-12",
//     "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851"
//   }
const db = require('../config/db.config');

exports.addPost = (data, callback) => {
    db.query(
        'INSERT INTO posts (description, imagePath, datetimeCreated,addedByUserId) VALUEs (?,?,?,?)',
        [data.description, data.imagePath, new Date(), data.addedByUserId],
        (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, `Post successful`);
        }

    );
}

exports.getAllPosts = (data, callback) => {
    db.query(
         `select p.id, p.description , p.datetimeCreated, p.likeCount, 
         p.dislikeCount, p.addedByUserId , u.firstName, u.lastName 
         from posts as p INNER JOIN users AS u ON p.addedByUserId = u.id`,
         [],
         (error, result, fields) => {
           // let postInString = JSON.stringify(result[0]);
            // console.log(result);
             if(error) {
                 return callback(error);
             }
             return callback(null, result);
         }
    );

}
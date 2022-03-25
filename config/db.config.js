const { createPool } = require("mysql");

/** Connection pool creation - START */
// const db = createPool({
//   port: 3306,
//   host: "us-cdbr-east-05.cleardb.net",
//   user: "bd87f1a8bcc9a6",
//   password: "85bb7c74",
//   database: "heroku_61131b50aa1b192",
//   connectionLimit: 10,
// });


/** Connection pool creation - START */
const db = createPool({
  port: 3306,
  host: "csye622506.csapfweat4lm.us-east-1.rds.amazonaws.com",
  user: "csye622506",
  password: "3205416536Cxy",
  database: "csye622506",
  connectionLimit: 10,
});


// db.getConnection(function (err) {
//   if (err) throw err;
//   console.log("Connected!");

//   var drop1 = "DROP TABLE IF EXISTS `users`;"
//   db.query(drop1, function (err, result) {
//     if (err) throw err;
//     console.log("drop1");
//   });
//   setTimeout(function () {
//     var sql =
//       "CREATE TABLE users(" +
//       "`id` int(11) NOT NULL AUTO_INCREMENT," +
//       "`firstName` varchar(45) NOT NULL," +
//       "`lastName` varchar(45) NOT NULL," +
//       "`emailId` varchar(45) NOT NULL," +
//       "`password` varchar(100) NOT NULL," +
//       "`account_created` datetime NOT NULL," +
//       "`account_updated` datetime NOT NULL," +
//       "PRIMARY KEY (`id`)," +
//       "UNIQUE KEY `emailId_UNIQUE` (`emailId`))"
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("users Table created");
//     });
//   }, 1000);


//   var drop2 = "DROP TABLE IF EXISTS `images`;"
//   db.query(drop2, function (err, result) {
//     if (err) throw err;
//     console.log("drop2");
//   });
//   setTimeout(function () {
//     var sql2 = "CREATE TABLE images(" +
//       "`id` int(45) NOT NULL AUTO_INCREMENT," +
//       "`description` varchar(1000) NOT NULL," +
//       "`imagePath` varchar(1000) NOT NULL," +
//       "`datetimeCreated` datetime NOT NULL," +
//       "`addedByUserId` int(11) NOT NULL," +
//       "PRIMARY KEY (`id`))"

//     db.query(sql2, function (err, result) {
//       if (err) throw err;
//       console.log("images Table created");
//     });
//   }, 1000);

// });

module.exports = db;



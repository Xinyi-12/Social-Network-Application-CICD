const { createPool } = require("mysql");

/** Connection pool creation - START */



/** Connection pool creation - START */
const db = createPool({
  connectionLimit: 10,
});


db.getConnection(function (err) {
  if (err) throw err;
  console.log("Connected!");

  var drop1 = "DROP TABLE IF EXISTS `users`;"
  db.query(drop1, function (err, result) {
    if (err) throw err;
    console.log("drop1");
  });
  setTimeout(function () {
    var sql =
      "CREATE TABLE users(" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`firstName` varchar(45) NOT NULL," +
      "`lastName` varchar(45) NOT NULL," +
      "`emailId` varchar(45) NOT NULL," +
      "`password` varchar(100) NOT NULL," +
      "`account_created` datetime NOT NULL," +
      "`account_updated` datetime NOT NULL," +
      "PRIMARY KEY (`id`)," +
      "UNIQUE KEY `emailId_UNIQUE` (`emailId`))"
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("users Table created");
    });
  }, 1000);


  var drop2 = "DROP TABLE IF EXISTS `images`;"
  db.query(drop2, function (err, result) {
    if (err) throw err;
    console.log("drop2");
  });
  setTimeout(function () {
    var sql2 = "CREATE TABLE images(" +
      "`id` int(45) NOT NULL AUTO_INCREMENT," +
      "`description` varchar(1000) NOT NULL," +
      "`imagePath` varchar(1000) NOT NULL," +
      "`datetimeCreated` datetime NOT NULL," +
      "`addedByUserId` int(11) NOT NULL," +
      "PRIMARY KEY (`id`))"

    db.query(sql2, function (err, result) {
      if (err) throw err;
      console.log("images Table created");
    });
  }, 1000);

});

module.exports = db;



const { createPool } = require("mysql");

/** Connection pool creation - START */
const db = createPool({
  port: 3306,
  host: "us-cdbr-east-05.cleardb.net",
  user: "bd87f1a8bcc9a6",
  password: "85bb7c74",
  database: "heroku_61131b50aa1b192",
  connectionLimit: 10,
});


/** Connection pool creation - START */
// const db = createPool({
//   port: 3306,
//   host: "csye622503.csapfweat4lm.us-east-1.rds.amazonaws.com",
//   user: "csye622504",
//   password: "3205416536Cxy",
//   database: "csye622504",
//   connectionLimit: 10,
// });

/** Connection pool creation - END */
db.getConnection((err) => {
  if(err){
    console.log(err.message);
    return;
  }
  console.log("connected");
})
module.exports = db;

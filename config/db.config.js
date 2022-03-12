const { createPool } = require("mysql");

/** Connection pool creation - START */
const db = createPool({
  port: 3306,
  host: "us-cdbr-east-05.cleardb.net",
  user: "csye622504",
  password: "3205416536Cxy",
  database: "csye622504",
  connectionLimit: 10,
});
/** Connection pool creation - END */

db.connet((err) => {
  if(err){
    console.log(err.message);
    return;
  }
  console.log("connected");
})
module.exports = db;

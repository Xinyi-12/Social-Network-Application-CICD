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
/** Connection pool creation - END */

module.exports = db;

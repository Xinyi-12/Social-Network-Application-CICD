const jwt = require("jsonwebtoken");

const secretKey = "secretKey";
module.exports = {
  secretKey : "secretKey"
}
// create token
module.exports.generateToken = function (payload) { 
  const token =
    "Bearer " +
    jwt.sign(payload, secretKey, {
      expiresIn: 60 * 60,
    });
  return token;
};

// check token
module.exports.verifyToken = function (req, res, next) {

  if(req.headers.authorization == undefined){
    return res.json({ code: "401", msg: "invalid token" })
  }
  const token = req.headers.authorization.split(' ')[1];
  console.log("verify=" + token)
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log("verify error", err);
      return res.json({ code: "401", msg: "invalid token" });
    }
  
    next();
  });
};

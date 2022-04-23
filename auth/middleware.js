const jwt = require('jsonwebtoken');
// var jwt = require('jwt-simple');

async function authenticateToken(req, res, next) {
  const authHeader = await req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  var decoded = jwt.decode(token);
 
  // get the decoded payload and header
  var decoded = jwt.decode(token, {complete: true});
  req.user = decoded.payload
  // console.log(decoded.header);
  // console.log(decoded.payload);
  next()
}

module.exports = {authenticateToken}
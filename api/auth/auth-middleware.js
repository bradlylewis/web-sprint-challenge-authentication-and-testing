const User = require('../users/users-model')
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./../config");

const validateCredentials = (req, res, next) => {
  const { username, password } = req.body;
  if (username.trim() === "" || password.trim() === "") {
    res.status(401).json({
      message: "username and password required"      
    })
  }
  else {
    next()
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) {
      next()
    } 
    else {
      next({ message: "username taken", status: 422  })
    } 
  } catch (err) {
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (users.length) {
      req.user = users[0]
      next()
    }
    else {
      next({ message: "Invalid credentials", status: 401  })
    } 
  } catch (err) {
    next(err)
  }
}

function tokenBuilder(user) {
  // {id, username, role}
  const payload = {
    sub: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "2d",
  };
  const result = jwt.sign(payload, JWT_SECRET, options);
  return result;
}

module.exports = {
  tokenBuilder,
  checkUsernameFree,
  checkUsernameExists,
  validateCredentials
}
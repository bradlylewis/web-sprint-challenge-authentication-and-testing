const User = require('../users/users-model')

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401, message: "You shall not pass!"
    })
  }
}

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

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  validateCredentials
}
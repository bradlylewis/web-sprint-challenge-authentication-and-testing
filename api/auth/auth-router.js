const router = require('express').Router();
const bcrypt = require("bcryptjs")
const { default: jwtDecode } = require("jwt-decode");
const { JWT_SECRET } = require("../secrets"); // use this secret!
const User = require('../users/users-model');
const {
  restricted,
  validateCredentials,
  checkUsernameFree,
  checkUsernameExists
} = require('./auth-middleware')
 
router.post('/register', validateCredentials, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)

  User.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch (next)
});

router.post('/login', checkUsernameExists, (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
 res.json('This is a login')
});

module.exports = router;

const router = require('express').Router();
const bcrypt = require("bcryptjs")
const User = require('../users/users-model');
const {
  tokenBuilder,
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

router.post('/login', validateCredentials,checkUsernameExists, (req, res, next) => {
  
  let { username, password } = req.body;
  User.findBy({ username })
    .then(([ user ]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = tokenBuilder(user);
        res.status(200).json({
          message: `Welcome back ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ 
          message: "invalid credentials" 
        });
      }
    })
    .catch(next);
});

module.exports = router;

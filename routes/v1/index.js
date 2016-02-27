var express = require('express');
var router  = express.Router();

var usersRoutes = require('./users.js');

module.exports = router.use('/users', usersRoutes);

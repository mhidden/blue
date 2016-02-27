var express = require('express');
var router  = express.Router();

var usersRoutes = require('./users.js');
var eventsRoutes = require('./events.js');

module.exports = router.use('/users', usersRoutes);
module.exports = router.use('/events', eventsRoutes);

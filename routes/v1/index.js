var express = require('express');
var router  = express.Router();

var usersRoutes = require('./users.js');
var eventsRoutes = require('./events.js');
var ticketsRoutes = require('./tickets.js');

module.exports = router.use('/users', usersRoutes);
module.exports = router.use('/events', eventsRoutes);
module.exports = router.use('/tickets', ticketsRoutes);

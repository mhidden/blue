var express = require('express');
var router  = express.Router();

var v1Routes = require('./v1');

module.exports = router.use('/v1', v1Routes);
env       = process.env.NODE_ENV || "development";
path      = require("path");
config    = require(path.join(__dirname, 'config', 'config.json'))[env];

var bodyParser = require('body-parser');
var express = require('express');
var app = module.exports = express();
var serializer = require('./serializer');
errorHandler = require('./utils').errorHandler;
authentication = require('./utils').authentication

models = require('./models');
routes = require('./routes');

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
});

app.use(serializer.middleware);
app.use(authentication.middleware)

app.use(routes);

app.server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  app.server.on('error', function (error) {
		console.log(error);
	})
});



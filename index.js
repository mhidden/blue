env       = process.env.NODE_ENV || "development";
path      = require("path");
config    = require(path.join(__dirname, 'config', 'config.json'))[env];

var bodyParser = require('body-parser')
var express = require('express');
var app = module.exports = express();
var serializer = require('./serializer')

errorHandler = function (err, req, res) {
	// console.log(err);
	res.status(500).send();
}

models = require('./models');
routes = require('./routes');

app.use(bodyParser.json());


app.use(function (req, res, next) {
	res.sendObject = function (object) {
		res.json(serializer.Serialize(object));
	}
	next();
})

app.use(routes);

app.use(function (err, req, res, next) {
	console.log(err, req,res, next);
});

app.server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  app.server.on('error', function (error) {
		console.log(error);
	})
});



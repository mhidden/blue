var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) {
	models.User.findAll().then(function (users) {
		res.status(200).sendObject(users);
	}).catch(function (err) { errorHandler(err, req, res); });
});

router.post('/', function (req, res) {
	models.User.create(req.body).then(function (user) {
		res.status(201).sendObject(user);
	}).catch(function (err) { errorHandler(err, req, res); });
});

router.get('/:id', function (req, res) {
	models.User.findOne({where: {id: req.params.id }}).then(function (user) {
		res.status(200).sendObject(user);
	}).catch(function (err) { errorHandler(err, req, res); });
});

module.exports = router;
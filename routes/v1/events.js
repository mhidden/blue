var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) {
	models.Event.findAll().then(function (events) {
		res.sendObject(events);
	}).catch(function (err) { errorHandler(err, req, res); });;
});

router.post('/', function (req, res) {
	models.Event.create(req.body).then(function (event_created) {
		res.status(201).sendObject(event_created);
	}).catch(function (err) { errorHandler(err, req, res); });
});

router.get('/:id', function (req, res) {
	models.Event.findOne({where: {id: req.params.id } }).then(function (event_retrieved) {
		res.sendObject(event_retrieved);
	}).catch(function (err) { errorHandler(err, req, res); });;
})

module.exports = router;
var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) {
	models.Event.findAll({ where: req.query, include: [{model: models.Ticket}] }).then(function (events) {
		res.sendObject(events);
	});
});

router.post('/', authentication.adminOnly, function (req, res) {
	models.Event.create(req.body).then(function (eventCreated) {
		res.status(201).sendObject(eventCreated);
	}).catch(function (err) { errorHandler(err, req, res); });
});

router.get('/:id', function (req, res) {
	models.Event.findOne({where: {id: req.params.id }, include: [{model: models.Ticket}] }).then(function (eventRetrieved) {
		res.sendObject(eventRetrieved);
	}).catch(function (err) { errorHandler(err, req, res); });
});

router.put('/:id', authentication.adminOnly, function (req, res) {
	models.Event.findOne({where: {id: req.params.id }, include: [{model: models.Ticket}] }).then(function (eventRetrieved) {
		eventRetrieved.update(req.body).then(function (event_updated) {
			res.sendObject(event_updated);	
		}).catch(function (err) { errorHandler(err, req, res); });
	}).catch(function (err) { errorHandler(err, req, res); });
});

router.delete('/:id', authentication.adminOnly, function (req, res) {
	models.Event.findOne({where: {id: req.params.id }, include: [{model: models.Ticket}] }).then(function (eventRetrieved) {
		eventRetrieved.destroy().then(function () {
			res.sendObject({});	
		}).catch(function (err) { errorHandler(err, req, res); });
	}).catch(function (err) { errorHandler(err, req, res); });
});

module.exports = router;
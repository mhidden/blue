var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) {
	filters = req.query;
	if (!filters['date']) {
		filters['date'] = new Date();
	}
	filters['date'] = {$gte: filters['date']};
	if (!req.user) {
		filters['published'] = true;
	}
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
	filters = {id: req.params.id }
	if (!req.user) {
		filters['published'] = true;
	}
	models.Event.findOne({where: filters, include: [{model: models.Ticket}] }).then(function (eventRetrieved) {
		if (eventRetrieved, eventRetrieved) {
			res.sendObject(eventRetrieved);	
		} else {
			res.status(404).send();
		}
		
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
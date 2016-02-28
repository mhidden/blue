var express = require('express');
var router  = express.Router();

router.post('/', function (req, res) {
	models.Event.findOne({where: {id: req.body.event_id }, include: [{model: models.Ticket}] })
	.then(function (eventRetrieved) {
		if (eventRetrieved.Tickets.length < eventRetrieved.capacity) {
			models.Ticket.findOne({where: req.body}).then(function (ticketRetrieved) {
				if (ticketRetrieved) {
					res.status(200).sendObject(ticketRetrieved);
				} else {
					models.Ticket.create(req.body).then(function (ticketCreated) {
						res.status(201).sendObject(ticketCreated);
					});		
				}
			});		
		} else {
			res.status(403).send();
		}
	});
});

module.exports = router;
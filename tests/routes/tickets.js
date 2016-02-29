function baseUserURI() {
	return config.address + '/v1/tickets';
}

function optionsPost(logged) {
	var options = {
	  uri: baseUserURI(),
	  method: 'POST',
	  json: data,
	};	
	if (logged) {
		options['headers'] = { "Authorization":"Token: " + logged.token };
	}
	return options;
}

module.exports =  {
	setUp: function (callback) {
		var self = this;
		models.User.create(utils.getUserData()).then(function (userCreated) {
			models.Event.create(utils.getEventData()).then(function (eventCreated) {
				self.userCreated = userCreated;
				self.eventCreated = eventCreated;
				callback();
			});
		});
	},
	testCreateTicketUnloged: function (test) {
		ticketData = {event_id:this.eventCreated.id, user_id:this.userCreated.id};
		options = optionsPost();
		options['json'] = ticketData;
		request(
			options,
			function (error, response, body) {
				test.equal(response.statusCode, 401);
				test.done();
			}
		);
	},
	testCreateTicket: function (test) {
		ticketData = {event_id:this.eventCreated.id, user_id:this.userCreated.id};
		options = optionsPost(this.userCreated);
		options['json'] = ticketData;
		request(
			options,
			function (error, response, body) {
				test.equal(response.statusCode, 201);
				models.Ticket.findAll({where:ticketData}).then(function (tickets) {
					test.equal(tickets.length,1)
					test.equal(tickets[0]['id'], body['id'])
					test.done();
				});
			}
		);
	},
	testCreateTicketExistent: function (test) {
		var self = this;
		ticketData = {event_id: this.eventCreated.id, user_id: this.userCreated.id};
		models.Ticket.create(ticketData).then(function (ticketCreated) {
			options = optionsPost(self.userCreated);
			options['json'] = ticketData;
			request(
				options,
				function (error, response, body) {
					test.equal(response.statusCode, 200);
					for (f in ticketData) {
						test.equal(body[f], ticketData[f], f);
					}
					models.Ticket.findAll({where: ticketData}).then(function (tickets) {
						test.equal(tickets.length,1)
						test.equal(tickets[0]['id'], body['id'])
						test.done();
					});
				}
			);
		});
	},
	testCreateTicketOverCapacity: function (test) {
		var self = this;
		this.eventCreated.update({capacity:1}).then(function (eventUpdated) {
			ticketData = {event_id: self.eventCreated.id, user_id: self.userCreated.id};
			models.Ticket.create(ticketData).then(function () {
				user_data = utils.getUserData();
				user_data['cpf'] = user_data['cpf'] + 'different';
				models.User.create(user_data).then(function (userCreated) {
					ticketData.user_id = userCreated.id;
					options = optionsPost(self.userCreated);
					options['json'] = ticketData;
					request(
						options,
						function (error, response, body) {
							test.equal(response.statusCode, 403);
							models.Ticket.findAll({where: {event_id:self.eventCreated.id}}).then(function (tickets) {
								test.equal(tickets.length,1)
								test.done();
							});
						}
					);
				});
			});
		});
	},
	testCreateTicketOtherUser: function (test) {
		var self = this;
		user_data = utils.getUserData();
		user_data['cpf'] = user_data['cpf'] + 'different';
		models.User.create(user_data).then(function (userCreated) {
			ticketData.user_id = userCreated.id;
			options = optionsPost(self.userCreated);
			options['json'] = ticketData;
			request(
				options,
				function (error, response, body) {
					test.equal(response.statusCode, 403);
					models.Ticket.findAll({where: {event_id:self.eventCreated.id}}).then(function (tickets) {
						test.equal(tickets.length,0)
						test.done();
					});
				}
			);
		});
	},
	tearDown: function (callback) {
		models.Ticket.destroy({where: {}}).then(function () {});
		models.User.destroy({where: {}}).then(function () {});
    models.Event.destroy({where: {}}).then(function () {});
    callback();
  }
}

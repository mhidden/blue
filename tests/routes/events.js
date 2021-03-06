function baseEventURI() {
	return config.address + '/v1/events';
}
function baseOptions(type, admin) {
	var options = {
		uri: baseEventURI(),
	  method: type,
	  json: {}
	};
	if (admin) {
		options['headers'] = { "Authorization":"Token: " + admin.token };
	}
	return options;
}

function optionsGet(admin) {
	return baseOptions('GET', admin);
}

function optionsPost(admin) {
	opt = baseOptions('POST', admin);
	opt['json'] = utils.getEventData();
	return opt;
}

function optionsPut(admin) {
	opt = baseOptions('PUT', admin);
	opt['json'] = utils.getEventData();
	return opt;
}
function differentEventData(data) {
	for (var i in data) {
		if (i == 'date') {
			data[i] = utils.createFutureDate(10, data[i]).toISOString();
		} else if (i == 'event_type') {
			data[i] = models.Event.rawAttributes.event_type.values[2];
		} else if (i == 'published') {
			data[i] = !data[i];
		} else if (i == 'capacity') {
			data[i] = data[i] + 10;
		} else {
			data[i] = data[i] + 'random';
		}
	}
	return data;
}

function testListWithFilter(test, field, value, quantity) {
	data = utils.getEventData();
	data[field] = value;
	models.Event.create(data).then(function (firstCreated) {
		otherData = differentEventData(data);
		models.Event.create(otherData).then(function (secondCreated) {
			options = optionsGet();
			options['qs'] = {};
			options['qs'][field] = value;
			if (field == 'published') {
				options['qs'][field] = value ? 1 : 0;
			}
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(body.length, quantity);
				test.done();
			});	
		});
	});
}

module.exports = { 
	// TODO: Refactor admins/not admins methods (almost the same);
	setUp: function (callback) {
		var self = this;
		userData = {cpf:'admin-user', password:'admin-password', admin:true};
		models.User.create(userData).then(function (userCreated) {
			self.adminUser = userCreated;
			callback();
		});
	},
	testCreateEventAdmin: function (test) {
		request(
			optionsPost(this.adminUser),
			function (error, response, body) {
				test.equal(response.statusCode, 201);
				models.Event.findAll({'name':utils.getEventData()['name']}).then(function (events) {
					test.equal(events.length,1)
					test.equal(events[0]['id'], body['id'])
					test.done();
				});
			}
		);
	},
	testCreateEventNotAdmin: function (test) {
		request(
			optionsPost(),
			function (error, response, body) {
				test.equal(response.statusCode, 403);
				test.done();
			}
		);
	},
	testDeleteEventAdmin: function (test) {
		var self = this;
		models.Event.create(utils.getEventData()).then(function (eventCreated) {
			options = baseOptions('DELETE', self.adminUser)
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				models.Event.findAll().then(function (events) {
					test.equal(events.length, 0);
					test.equal(response.statusCode,200);
					test.done();	
				});
			});
		});
	},
	testDeleteEventNotAdmin: function (test) {
		var self = this;
		models.Event.create(utils.getEventData()).then(function (eventCreated) {
			options = baseOptions('DELETE')
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				models.Event.findAll().then(function (events) {
					test.equal(events.length, 1);
					test.equal(response.statusCode,403);
					test.done();	
				});
			});
		});
	},
	testCreatePastEventAdmin: function (test) {
		dataPast = optionsPost(this.adminUser);
		dataPast['json']['date'] = new Date('2015-10-10').toISOString();
		request(
			dataPast,
			function (error, response, body) {
				test.equal(response.statusCode, 400);
				test.equal(body['date'], 'Please choose date in future');
				test.done();
			}
		);
	},
	testCreatePastEventNotAdmin: function (test) {
		dataPast = optionsPost();
		dataPast['json']['date'] = new Date('2015-10-10').toISOString();
		request(
			dataPast,
			function (error, response, body) {
				test.equal(response.statusCode, 403);
				test.done();
			}
		);
	},
	testRetrieveEvent: function (test) {
		models.Event.create(utils.getEventData()).then(function (eventCreated) {
			options = optionsGet();
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(eventCreated.id, body['id']);
				test.done();
			});
		});
	},
	testUpdateEventAdmin: function (test) {
		var self = this;
		models.Event.create(utils.getEventData()).then(function (eventCreated) {
			options = optionsPut(self.adminUser);
			updatedData = differentEventData(options['json']);
			options['json'] = updatedData;
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(eventCreated.id, body['id']);
				updatedData['id'] = body['id'];
				for (f in updatedData) {
					test.equal(body[f], updatedData[f], f);
				}
				test.done();
			});
		});
	},
	testUpdateEventNotAdmin: function (test) {
		var self = this;
		models.Event.create(utils.getEventData()).then(function (eventCreated) {
			options = optionsPut();
			updatedData = differentEventData(options['json']);
			options['json'] = updatedData;
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 403);
				test.done();
			});
		});
	}, 
	testListEvents: function (test) {
		models.Event.create(utils.getEventData()).then(function (event) {
			var otherData = utils.getEventData();
			otherData['name'] = "Show do Luan Santana";
			models.Event.create(otherData).then(function (event) {
				request(optionsGet(), function (error, response, body) {
					test.equal(response.statusCode, 200);
					test.equal(body.length, 2);
					test.done();
				});
			})
		});
	},
	testListWithFilterName: function (test) {
		testListWithFilter(test, 'name', 'a', 1);
	},
	testListWithFilterDate: function (test) {
		testListWithFilter(test, 'date', utils.createFutureDate(3), 1);
	},
	testListWithFilterOrganizer: function (test) {
		testListWithFilter(test, 'organizer', 'organizer123', 1);
	},
	testListWithFilterDescription: function (test) {
		testListWithFilter(test, 'description', 'a', 1);
	},
	testListWithFilterEventType: function (test) {
		testListWithFilter(test, 'event_type', models.Event.rawAttributes.event_type.values[1], 1);
	},
	testListWithFilterCapacity: function (test) {
		testListWithFilter(test, 'capacity', 666, 1);
	},
	testListWithFilterPublished: function (test) {
		testListWithFilter(test, 'published', true, 1);
	},
	testTicketsLeft: function (test) {
		models.User.create(utils.getUserData()).then(function (userCreated) {
			models.Event.create(utils.getEventData()).then(function (eventCreated) {
				models.Ticket.create({event_id:eventCreated.id, user_id:userCreated.id}).then(function (ticket) {
					options = optionsGet();
					options['uri'] = options['uri'] + '/' + eventCreated.id;
					request(options, function (error, response, body) {
						test.equal(response.statusCode, 200);
						test.equal(eventCreated.id, body['id']);
						test.equal((eventCreated.capacity-1), body['tickets_left']);
						test.done();
					});
				});
			});	
		});
	},
	tearDown: function (callback) {
		models.User.destroy({where: {}}).then(function () {});
    models.Event.destroy({where: {}}).then(function () {});
    models.Ticket.destroy({where: {}}).then(function () {});
    callback();
  }
}


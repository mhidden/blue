function createFutureDate(days, startDate) {
	date = new Date();
	if (startDate) {
		date = new Date(startDate);
	}

	date.setDate(date.getDate() + days)
	return date;
}

function getEventData() {
	var data = {
		'name':'Show do RHCP', 
		'description':'Esta é a descrição do show...',
		'organizer':'Grupo RBS',
		'date':createFutureDate(1, undefined).toISOString(),
		'capacity':10,
		'event_type':models.Event.rawAttributes.event_type.values[0],
		'published':false
	}	
	return data;
}

function baseEventURI() {
	return config.address + '/v1/events';
}
function baseOptions(type) {
	var options = {
		uri: baseEventURI(),
	  method: type,
	  json: {}
	};
	return options;
}

function optionsGet() {
	return baseOptions('GET');
}

function optionsPost() {
	opt = baseOptions('POST');
	opt['json'] = getEventData();
	return opt;
}

function optionsPut() {
	opt = baseOptions('PUT');
	opt['json'] = getEventData();
	return opt;
}
function differentEventData(data) {
	for (var i in data) {
		if (i == 'date') {
			data[i] = createFutureDate(10, data[i]).toISOString();
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
function testListWithFilter(test, field, value) {
	data = getEventData();
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
				test.equal(body.length, 1);
				test.done();
			});	
		});
	});
}

module.exports = { 
	testCreateEvent: function (test) {
		request(
			optionsPost(),
			function (error, response, body) {
				test.equal(response.statusCode, 201);
				models.Event.findAll({'name':getEventData()['name']}).then(function (events) {
					test.equal(events.length,1)
					test.equal(events[0]['id'], body['id'])
					test.done();
				});
			}
		);
	},
	testDeleteEvent: function (test) {
		models.Event.create(getEventData()).then(function (eventCreated) {
			options = baseOptions('DELETE')
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
	testCreatePastEvent: function (test) {
		dataPast = optionsPost();
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
	testRetrieveEvent: function (test) {
		models.Event.create(getEventData()).then(function (eventCreated) {
			options = optionsGet();
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(eventCreated.id, body['id']);
				test.done();
			});
		});
	},
	testUpdateEvent: function (test) {
		models.Event.create(getEventData()).then(function (eventCreated) {
			options = optionsPut();
			updatedData = differentEventData(options['json']);
			options['json'] = updatedData;
			options['uri'] = options['uri'] + '/' + eventCreated.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(eventCreated.id, body['id']);
				updatedData['id'] = body['id'];
				for (f in body) {
					test.equal(body[f], updatedData[f], f)
				}
				test.done();
			});
		});
	}, 
	testListEvents: function (test) {
		models.Event.create(getEventData()).then(function (user) {
			var otherData = getEventData();
			otherData['name'] = "Show do Luan Santana";
			models.Event.create(otherData).then(function (user) {
				request(optionsGet(), function (error, response, body) {
					test.equal(response.statusCode, 200);
					test.equal(body.length, 2);
					test.done();
				});
			})
		});
	},
	testListWithFilterName: function (test) {
		testListWithFilter(test, 'name', 'a');
	},
	testListWithFilterDate: function (test) {
		testListWithFilter(test, 'date', createFutureDate(3));
	},
	testListWithFilterOrganizer: function (test) {
		testListWithFilter(test, 'organizer', 'organizer123');
	},
	testListWithFilterDescription: function (test) {
		testListWithFilter(test, 'description', 'a');
	},
	testListWithFilterEventType: function (test) {
		testListWithFilter(test, 'event_type', models.Event.rawAttributes.event_type.values[1]);
	},
	testListWithFilterCapacity: function (test) {
		testListWithFilter(test, 'capacity', 666);
	},
	testListWithFilterPublished: function (test) {
		testListWithFilter(test, 'published', true);
	},

	tearDown: function (callback) {
    models.Event.destroy({where: {}}).then(function () {});
    callback();
  }
}


function createTomorrowDate() {
	date = new Date();
	date.setDate(date.getDate() + 1)
	return date;
}

function getEventData() {
	var data = {
		'name':'Show do RHCP', 
		'description':'Esta é a descrição do show...',
		'organizer':'Grupo RBS',
		'date':createTomorrowDate().toISOString(),
		'capacity':10,
		'event_type':models.Event.rawAttributes.event_type.values[0]
	}	
	return data;
}

function baseEventURI() {
	return config.address + '/v1/events';
}

function optionsGet() {
	var options = {
		uri: baseEventURI(),
	  method: 'GET',
	  json: {}
	};
	return options;
}

function optionsPost() {
	var options = {
	  uri: baseEventURI(),
	  method: 'POST',
	  json: getEventData()
	};

	return options;
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
	testCreatePastEvent: function (test) {
		data_past = optionsPost();
		data_past['json']['date'] = new Date('2015-10-10');
		request(
			data_past,
			function (error, response, body) {
				test.equal(response.statusCode, 400);
				test.equal(body['date'], 'Please choose date in future');
				test.done();
			}
		);
	},
	testRetrieveEvent: function (test) {
		models.Event.create(getEventData()).then(function (event_created) {
			options = optionsGet();
			options['uri'] = options['uri'] + '/' + event_created.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(event_created.id, body['id']);
				test.done();
			});
		});
	},
	testListEvents: function (test) {
		models.Event.create(getEventData()).then(function (user) {
			var other_data = getEventData();
			other_data['name'] = "Show do Luan Santana";
			models.Event.create(other_data).then(function (user) {
				request(optionsGet(), function (error, response, body) {
					test.equal(response.statusCode, 200);
					test.equal(body.length, 2);
					test.done();
				});
			})
		});
	},
	tearDown: function (callback) {
    models.Event.destroy({where: {}}).then(function () {});
    callback();
  }
}


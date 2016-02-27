var data = {'cpf':'000.000.000-00', 'password':'password'}


function optionsGet() {
	var options = {
		uri: config.address + '/v1/users',
	  method: 'GET',
	  json: {}
	};
	return options;
}


module.exports = { 
	testCreateUser: function (test) {
		var options = {
		  uri: config.address + '/v1/users',
		  method: 'POST',
		  json: data
		};

		request(
			options,
			function (error, response, body) {
				test.equal(response.statusCode, 201);
				models.User.findAll({'cpf':data['cpf']}).then(function (users) {
					test.equal(users.length,1)
					test.equal(users[0]['id'], body['id'])
					test.done();
				});
			}
		);
	},
	testRetrieveUser: function (test) {
		models.User.create(data).then(function (user) {
			options = optionsGet();
			options['uri'] = options['uri'] + '/' + user.id;
			request(options, function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(user.id, body['id']);
				test.done();
			});
		});
	},
	testListUsers: function (test) {
		models.User.create(data).then(function (user) {
			var other_data = data;
			other_data['cpf'] = '111.111.111-11';
			models.User.create(other_data).then(function (user) {
				request(optionsGet(), function (error, response, body) {
					test.equal(response.statusCode, 200);
					test.equal(body.length, 2);
					test.done();
				});
			})
		});
	},
	tearDown: function (callback) {
    models.User.destroy({where: {}}).then(function () {});
    callback();
  }
}


var data = utils.getUserData()

function baseUserURI() {
	return config.address + '/v1/users';
}

function optionsPost() {
	var options = {
	  uri: baseUserURI(),
	  method: 'POST',
	  json: data
	};	
	return options;
}

function optionsGet() {
	var options = {
		uri: baseUserURI(),
	  method: 'GET',
	  json: {}
	};
	return options;
}


module.exports = { 
	testCreateUser: function (test) {
		request(
			optionsPost(),
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
	testCreateNotUnique: function (test) {
		request(
			optionsPost(),
			function (error, response, body) {
				request(
					optionsPost(),
					function (error, response, body) {
						test.equal(response.statusCode, 400);
						test.equal(body['cpf'], 'cpf must be unique');
						test.done();
					}
				);
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


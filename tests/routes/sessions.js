function baseUserURI() {
	return config.address + '/v1/session';
}

function optionsGet() {
	var options = {
		uri: baseUserURI(),
	  method: 'GET',
	  json: {}
	};
	return options;
}

module.exports =  {
	setUp: function (callback) {
		var self = this;
		models.User.create(utils.getUserData()).then(function (userCreated) {
			self.userCreated = userCreated;
			callback();
		});
	},
	testSessionSuccess: function (test) {
		options = optionsGet();
		options['qs'] = utils.getUserData();
		request(
			options,
			function (error, response, body) {
				test.equal(response.statusCode, 200);
				test.equal(body['cpf'], utils.getUserData()['cpf']);
				test.done();
			}
		);
	},
	testSessionFail: function (test) {
		options = optionsGet();
		qs = utils.getUserData();
		qs['password'] = qs['password'] + 'something';
		options['qs'] = qs;
		request(
			options,
			function (error, response, body) {
				test.equal(response.statusCode, 403);
				test.done();
			}
		);
	},
	tearDown: function (callback) {
		models.User.destroy({where: {}}).then(function () {});
    callback();
  }
}

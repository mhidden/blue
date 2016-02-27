var passwordHash = require('password-hash')

module.exports = { 
	testPasswordMinSize: function (test) {
		models.User.create({cpf:'cpf',password:"012346"}).then(function (object) {
			test.ok(true, "Password doesn't have min size");
			test.done();
		}).catch(function (err) {
			test.done();
		});
	},
	testPasswordSize: function (test) {
		models.User.create({cpf:'cpf',password:"0123467"}).then(function (object) {
			test.done();
		})
	},
	testPasswordMatch: function (test) {
		var password = "01234567";
		models.User.create({cpf:'cpf',password:password}).then(function (o) {
			models.User.findOne({cpf:'cpf'}).then(function (object) {
				test.equal(true, passwordHash.verify(config.salt+password, object.password_hash));
				test.done();
			});
		});
	},
	testPasswordNotMatch: function (test) {
		var password = "01234567";
		models.User.create({cpf:'cpf',password:password}).then(function (object) {
			models.User.findOne({cpf:'cpf'}).then(function (object) {
				test.equal(false, passwordHash.verify(config.salt+password+"abc", object.password_hash));
				test.done();
			});
		});
	}, 
	tearDown: function (callback) {
    models.User.destroy({where: {}}).then(function () {});
    callback();
  }
}


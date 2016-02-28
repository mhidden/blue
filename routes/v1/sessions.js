var express = require('express');
var router  = express.Router();
var passwordHash = require('password-hash');

router.get('/', function (req, res) {
	models.User.findOne({where: { cpf: req.query.cpf } }).then(function (userRetrieved) {
		if (userRetrieved) {
			match = passwordHash.verify(config.salt+req.query.password, userRetrieved.password_hash)
			if (match) {
				res.status(200).json(userRetrieved);
			} else {
				res.status(403).send();
			}
		} else {
			res.status(403).send()
		}
	});
});

module.exports = router;
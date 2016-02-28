function errorHandler(err, req, res) {
	console.log(err);
	if (err.name.indexOf('Sequelize') !== -1) {
		errors = {}
		// console.log(err.errors);
		for (e in err.errors) {
			var error = err.errors[e];
			field = error['path'];
			message = error['message']
			errors[field] = message
		}
		res.status(400).json(errors);
	} else {
		res.status(500).send();	
	}
}

module.exports = errorHandler;
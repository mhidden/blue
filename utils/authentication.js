function middleware(req, res, next) {
	if (req.headers['authorization']) {
		token = req.headers['authorization'].replace("Token: ", "");
		models.User.findOne({where: { token: token } }).then(function (user) {
			req.user = user;
			next();
		});
	} else {
		next();	
	}
}

function adminOnly(req, res, next) {
	if (req.user && req.user.admin) {
		next();	
	} else {
		res.status(403).send();
	}
}

module.exports.middleware = middleware;
module.exports.adminOnly = adminOnly;
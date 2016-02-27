env       = process.env.NODE_ENV || "development";
path      = require("path");
config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

exports.test_models = require('./models');
exports.test_routes = require('./routes');
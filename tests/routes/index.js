var fs = require("fs")
var path = require("path")
var files = {}

app = require('../../index')
request = require('request')
utils = require('./utils')

fs.readdirSync(__dirname).forEach(function(file) {
  if (file != 'index.js' && file != 'utils.js') {
    files[file] = require('./' + file)
  }
});

module.exports = files

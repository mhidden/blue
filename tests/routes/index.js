var fs = require("fs")
var path = require("path")
var files = {}

app = require('../../index')
request = require('request')

fs.readdirSync(__dirname).forEach(function(file) {
  if (file != 'index.js') {
    files[file] = require('./' + file)
  }
});

module.exports = files

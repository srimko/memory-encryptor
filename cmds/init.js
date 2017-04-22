const fs = require('fs')
const vorpal = require('vorpal')();
const path = require('path');

function init (file) {
  if(!fs.existsSync('files')) {
      fs.mkdirSync('files')
      vorpal.log('don\'t already exist')
    } else {
      vorpal.log('files already exist')
    }
}

module.exports = function (vorpal, options) {
  vorpal
    .command('init', 'file to encrypt')
    .alias('in')
    .alias('i')
    .action(function(args, callback) {
      init()
    });
}

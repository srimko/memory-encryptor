'use strict'

const init = require('./cmds/init')
const encrypt = require('./cmds/encrypt')
const decrypt = require('./cmds/decrypt')

const encryptor = require('file-encryptor')
const md5 = require('md5');
const path = require('path');
const fs = require('fs')
const vorpal = require('vorpal')();

let appConfig = {
  password: md5('password'),
  key: 'blablabla'
}

vorpal
  .command('password', 'Password')
  .alias('pass', 'p')
  .action(function(args, callback) {
    const self = this;

    let files = fs.readdirSync('files')
    self.log(typeof files)
    self.prompt({
      type: 'password',
      name: 'password',
      message: 'password ? '
    }, function(result){
      self.log(result)
      if(md5(result.password) !== appConfig.password) {
        self.log('Bad password')
      } else {
        self.log('It\'s ok for you')
        self.prompt({
          type: 'password',
          name: 'password',
          message: 'password ? '
        }, function(result){
          self.log(result)
          if(md5(result.password) !== appConfig.password) {
            self.log('Bad password')
          } else {
            self.log('It\'s ok for you')
          }
        })
      }
    })
    this.log('args', args);
  });

vorpal
  .delimiter('memoryEncryptor $')
  .use(init)
  .use(encrypt)
  .use(decrypt)
  .show();

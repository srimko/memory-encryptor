const fs = require('fs')
const encryptor = require('file-encryptor')
const vorpal = require('vorpal')();
const path = require('path');
const md5 = require('md5');

let appConfig = {
  password: md5('password'),
  key: 'blablabla'
}

function encrypt (file) {
  encryptor.encryptFile('files/' + file, 'files_encrypt/' + path.basename(file, '.md') + '_encrypted.dat', appConfig.key, function (err) {
    if (err) throw err
    else {
      fs.unlinkSync('files/' + file)
    }
  })
}

function encrypts (files) {
  _.each(files, function (file) {
    encryptor.encryptFile('files/' + file, 'files_encrypt/' + path.basename(file, '.md') + '_encrypted.dat', appConfig.key, function (err) {
      if (err) throw err
      else {
        fs.unlinkSync('files/' + file)
      }
    })
  })

}

module.exports = function (vorpal, options) {
  vorpal
    .command('encrypt', 'file to encrypt')
    .alias('ncrpt')
    .alias('n')
    .action(function(args, callback) {
      const self = this;

      let files = fs.readdirSync('files')
      self.log(typeof files)
      return this.prompt({
        type: 'list',
        name: 'encrypt',
        message: 'Encrypt me ?',
        choices: files,
      }, function(result){
        self.log(result.encrypt)
        encrypt(result.encrypt)
      })
      this.log('args', args);
    });
}

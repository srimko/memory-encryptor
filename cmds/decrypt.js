const fs = require('fs')
const encryptor = require('file-encryptor')
const vorpal = require('vorpal')();
const path = require('path');
const md5 = require('md5');

const cheerio = require('cheerio')

const Entities = require('html-entities').AllHtmlEntities

const md = require( "markdown" ).markdown;
const HTMLToMd = require('html-md');

const chalk = require('chalk')

let red = chalk.red
let blue = chalk.blue
let green = chalk.green

let exec = require('child_process').exec

let appConfig = {
  password: md5('password'),
  key: 'blablabla',
  tempDecryptPass : null
}

function decrypt (file, decryptPass, exportToMarkdow) {
  if(decryptPass !== appConfig.key) {
    vorpal.log(red('Bad decrypt key'))
  } else {
    encryptor.decryptFile('files_encrypt/' + path.basename(file, '.dat') + '.dat', 'output_file.md', decryptPass, function (err) {
      if (err) {
        vorpal.log(err)
      }
      else {
        let mdData = fs.readFileSync('output_file.md', 'utf8')

        htmlData = md.toHTML(mdData)

        let $ = cheerio.load(htmlData)
        $('h2').addClass('title')
        htmlData = Entities.decode($.html())
        let header = `<!DOCTYPE html>
        <html>
        <head>
        <title>${path.basename(file, '.dat')}</title>
        </head>
        <body>`
        let end = `</body>
        </html>`
        fs.writeFileSync(path.basename(file, '.dat') + '.html', header + htmlData + end)

        if(exportToMarkdow) {
          // vorpal.log(HTMLToMd(htmlData))
          fs.writeFileSync('files/' + path.basename(file, '.dat').replace('_encrypted', '_new') + '.md', HTMLToMd(htmlData))
        }

        exec('open ' + path.basename(file, '.dat') + '.html')
      }
    })
  }
}

module.exports = function (vorpal, options) {
  vorpal
    .command('decrypt', 'file to encrypt')
    .alias('dec')
    .alias('dc')
    .alias('dcrpt')
    .alias('d')
    .option('-m, --markdown', 'Export file into mardown')
    .action(function (args, callback) {
      const self = this
      let exportToMarkdow = false

      if(args.options.markdown) {
        exportToMarkdow = true
      }

      self.prompt({
        type: 'password',
        name: 'password',
        message: 'password ? '
      },
      function (result) {
        if(md5(result.password) !== appConfig.password) {
          self.log('Bad password')
        } else {
          self.log('It\'s ok for you')
          self.prompt({
            type: 'password',
            name: 'decryptPass',
            message: 'Decrypt password ? '
          },
          function(result) {
            appConfig.tempDecryptPass = result.decryptPass
            let files = fs.readdirSync('files_encrypt')
            self.prompt({
              type: 'list',
              name: 'decrypt',
              message: 'Decrypt me ?',
              choices: files,
            }, function(result){
              decrypt(result.decrypt, appConfig.tempDecryptPass, exportToMarkdow)
            })
          })
        }
      })
    })
}

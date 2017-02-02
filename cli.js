#!/usr/bin/env node

const opts = require('minimist')(process.argv.slice(2))
const ora = require('ora')
const upmInstall = require('./index')

if (!opts.descriptorUrl || !opts.productUrl || !opts.username || !opts.password) {
  return console.log(`
    Usage: upm-install
      --descriptorUrl <url>
      --productUrl <url>
      --username <username>
      --password <password>
  `)
}

const spinner = ora('installing add-on').start()

upmInstall(opts)
  .then(function (res) {
    spinner.succeed(`successfully installed add-on '${res.name}'`)
  })
  .catch(function () {
    spinner.fail(`failed to install add-on`)
  })

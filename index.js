const got = require('got')
const url = require('url')

const RETRY_INTERVAL = 500

module.exports = function ({ descriptorUrl, productUrl, username, password }) {
  const normalizedProductUrl = productUrl.endsWith('/') ? productUrl.slice(0, -1) : productUrl
  const restApiUrl = `${normalizedProductUrl}/rest/plugins/1.0/`
  const authHash = (new Buffer(`${username}:${password}`)).toString('base64')
  const authHeader = `Basic ${authHash}`

  return got.head(restApiUrl, {
      headers: {
        Authorization: authHeader
      }
    })
    .then(function (res) {
      const upmToken = res.headers['upm-token']

      return got.post(`${restApiUrl}?token=${upmToken}`, {
          headers: {
            Authorization: authHeader,
            'content-type': 'application/vnd.atl.plugins.remote.install+json'
          },
          body: JSON.stringify({pluginUri: descriptorUrl})
        })
    })
    .then(function (res) {
      return new Promise(function (resolve, reject) {
        const body = JSON.parse(res.body)
        const retryUrl = url.resolve(normalizedProductUrl, body.links.self)

        const retry = function () {
          got(retryUrl, {
            headers: {
              Authorization: authHeader,
              'content-type': 'application/vnd.atl.plugins.remote.install+json'
            }
          })
          .then(function (res) {
            const body = JSON.parse(res.body)
            const status = body.status

            if (status && !status.done) {
              return setTimeout(retry, RETRY_INTERVAL)
            }

            if (status && status.done &&
              status.contentType === 'application/vnd.atl.plugins.task.install.err+json') {
              return reject(body)
            }

            resolve(body)
          })
          .catch(function (res) {
            reject(res)
          })
        }

        setTimeout(retry, RETRY_INTERVAL)
      })
    })
}

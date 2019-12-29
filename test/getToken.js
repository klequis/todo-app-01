import request from 'request'
import config from 'config'

const getToken = () => {
  const cfg = config()
  const tokenEndpoint = cfg.auth0.getTokenEndpoint
  const clientId = cfg.auth0.clientId
  const clientSecret = cfg.auth0.clientSecret
  const appIdentifier = cfg.auth0.apiIdentifier

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: tokenEndpoint,
      headers: { 'content-type': 'application/json' },
      body: `{"client_id":"${clientId}","client_secret":"${clientSecret}","audience":"${appIdentifier}","grant_type":"client_credentials"}`
    }

    request(options, function(error, response, body) {
      const status = response.statusCode
      if (status < 200 || status >= 300) {
        console.log('ERROR body', body)
        reject(new Error(error))
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}

export default getToken

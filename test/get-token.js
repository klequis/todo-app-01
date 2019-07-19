import request from 'request'
import config from 'config'

const getToken = () => {
  // console.log('config', config)

  // console.group('config values')
  const tokenEndpoint = config.auth0.getTokenEndpoint
  // console.log('tokenEndpoint', tokenEndpoint);
  const clientId = config.auth0.clientId
  // console.log('clientId', clientId);
  const clientSecret = config.auth0.clientSecret
  // console.log('clientSecret', clientSecret);
  const appIdentifier = config.auth0.apiIdentifier
  // console.log('apiIdentifier', appIdentifier)
  // console.groupEnd()
  // console.log()
  
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: tokenEndpoint,
      headers: { 'content-type': 'application/json' },
      body: `{"client_id":"${clientId}","client_secret":"${
        clientSecret
      }","audience":"${
        appIdentifier
      }","grant_type":"client_credentials"}`
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

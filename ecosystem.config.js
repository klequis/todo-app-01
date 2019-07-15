module.exports = {
  apps: [
    {
      name: 'server',
      script: './app/server/index.js',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

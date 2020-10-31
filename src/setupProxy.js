const path = require('path')

const loginPaths = ['/', '/resetPassword', '/districtLogin']

module.exports = (app) => {
  app.use('/', (req, res, next) => {
    if (loginPaths.some((url) => req.url === url)) {
      res.set('cache-control', 'no-store')
      res.sendFile(path.join(__dirname, '..', 'dist', 'login', 'index.html'))
    } else {
      next()
    }
  })
}

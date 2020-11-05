const path = require('path')
const express = require('express')

const rootPath = path.join(__dirname, '..', 'dist', 'login', 'index.html')
const router = express.Router()

router.get('/', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/resetPassword', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/districtLogin', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/district/:shortName', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

module.exports = (app) => {
  app.use('/', router)
}

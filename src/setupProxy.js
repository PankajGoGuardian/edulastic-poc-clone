const path = require('path')
const express = require('express')

const rootPath = path.join(__dirname, '..', 'dist', 'login', 'index.html')
const router = express.Router()

router.get('/', (req, res, next) => {
  const query = new URLSearchParams(req.query)
  if (
    query.has('userId') ||
    query.has('role') ||
    query.has('token') ||
    query.has('itemBank') ||
    query.has('addAccount')
  ) {
    next()
  } else {
    res.set('cache-control', 'no-store')
    res.sendFile(rootPath)
  }
})

router.get('/resetPassword', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/districtLogin/:shortName', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/district/:shortName', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/school/:shortName', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/partnerLogin/:partner/Signup', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/partnerLogin/:partner', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/partnerLogin/:partner/GetStarted', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/AdminSignup', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/partnerLogin/:partner/AdminSignup', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

router.get('/partnerLogin/:partner/StudentSignup', (_, res) => {
  res.set('cache-control', 'no-store')
  res.sendFile(rootPath)
})

module.exports = (app) => {
  app.use('/', router)
}

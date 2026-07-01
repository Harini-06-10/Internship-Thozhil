// routes/main.js
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getUserById } = require('../db/database')

const router = express.Router()

// ---------- GET / ----------
router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard')
  return res.redirect('/login')
})

// ---------- GET /dashboard ----------
router.get('/dashboard', requireAuth, (req, res) => {
  const user = getUserById(req.session.userId)
  res.render('dashboard', { user })
})

// ---------- GET /idthirdeye ----------
router.get('/idthirdeye', requireAuth, (req, res) => {
  const user = getUserById(req.session.userId)
  res.render('idthirdeye', { user })
})

module.exports = router

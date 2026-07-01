// routes/main.js
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getUserById, createContactMessage } = require('../db/database')

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
  const contactMessage = req.session.contactMessage || null
  const contactError = req.session.contactError || null
  delete req.session.contactMessage
  delete req.session.contactError
  res.render('idthirdeye', { user, contactMessage, contactError })
})

// ---------- POST /contact ----------
router.post('/contact', requireAuth, (req, res) => {
  const { name, email, company, interest, message } = req.body

  if (!message || !message.trim()) {
    req.session.contactError = 'Please add a few details before sending.'
    return res.redirect('/idthirdeye')
  }

  createContactMessage({
    userId: req.session.userId,
    name: name || '',
    email: email || '',
    company: company || '',
    interest: interest || '',
    message: message.trim(),
  })

  req.session.contactMessage = 'Thanks — we received your message. We’ll reach out within one business day.'
  return res.redirect('/idthirdeye')
})

module.exports = router

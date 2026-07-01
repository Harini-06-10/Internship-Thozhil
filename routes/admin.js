// routes/admin.js
const express = require('express')
const requireAdmin = require('../middleware/requireAdmin')
const { getAllUsers, getTotalUserCount, deleteUser, getAllContactMessages, getContactMessageCount } = require('../db/database')

const router = express.Router()

// ============================================================
// ADMIN CREDENTIALS — change these before presenting/deploying
// In a real app these would be in a .env environment variable
// ============================================================
const ADMIN_EMAIL    = 'admin@idthirdeye.com'
const ADMIN_PASSWORD = 'Admin@1234'

// ---------- GET /admin/login ----------
router.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin/dashboard')
  res.render('admin-login', { error: null, oldInput: {} })
})

// ---------- POST /admin/login ----------
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body
  const oldInput = { email }

  if (!email || !password) {
    return res.render('admin-login', {
      error: 'Enter admin email and password.',
      oldInput,
    })
  }

  // Simple credential check — no bcrypt needed since these are
  // hardcoded admin credentials, not user-submitted passwords
  if (
    email.toLowerCase().trim() !== ADMIN_EMAIL ||
    password !== ADMIN_PASSWORD
  ) {
    return res.render('admin-login', {
      error: 'Invalid admin credentials.',
      oldInput,
    })
  }

  req.session.isAdmin = true

  const redirectTo = req.session.adminRedirectTo || '/admin/dashboard'
  delete req.session.adminRedirectTo
  return res.redirect(redirectTo)
})

// ---------- GET /admin/dashboard ----------
router.get('/admin/dashboard', requireAdmin, (req, res) => {
  const users = getAllUsers()
  const totalCount = getTotalUserCount()
  const messages = getAllContactMessages()
  const messageCount = getContactMessageCount()
  res.render('admin-dashboard', {
    users,
    totalCount,
    messages,
    messageCount,
    adminEmail: ADMIN_EMAIL,
    success: req.query.deleted ? 'User deleted successfully.' : null,
  })
})

// ---------- POST /admin/delete/:id ----------
router.post('/admin/delete/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id)
  if (!isNaN(id)) {
    deleteUser(id)
  }
  res.redirect('/admin/dashboard?deleted=1')
})

// ---------- POST /admin/logout ----------
router.post('/admin/logout', (req, res) => {
  req.session.isAdmin = false
  delete req.session.isAdmin
  res.redirect('/admin/login')
})

module.exports = router

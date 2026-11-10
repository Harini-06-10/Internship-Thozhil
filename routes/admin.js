
const express = require('express')
const requireAdmin = require('../middleware/requireAdmin')

const {
  getAllUsers,
  getTotalUserCount,
  deleteUser,
  getAllContactMessages,
  getContactMessageCount
} = require('../db/database')

const router = express.Router()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

// GET admin login
router.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin/dashboard')
  }

  res.render('admin-login', {
    error: null,
    oldInput: {}
  })
})

// POST admin login
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body
  const oldInput = { email }

  if (!email || !password) {
    return res.render('admin-login', {
      error: 'Enter admin email and password.',
      oldInput
    })
  }

  if (
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD ||
    email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim() ||
    password !== ADMIN_PASSWORD
  ) {
    return res.render('admin-login', {
      error: 'Invalid admin credentials.',
      oldInput
    })
  }

  req.session.isAdmin = true

  const redirectTo =
    req.session.adminRedirectTo || '/admin/dashboard'

  delete req.session.adminRedirectTo

  return res.redirect(redirectTo)
})

// GET admin dashboard
router.get('/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const [users, totalCount, messages, messageCount] =
      await Promise.all([
        getAllUsers(),
        getTotalUserCount(),
        getAllContactMessages(),
        getContactMessageCount()
      ])

    res.render('admin-dashboard', {
      users,
      totalCount,
      messages,
      messageCount,
      adminEmail: ADMIN_EMAIL,
      success: req.query.deleted
        ? 'User deleted successfully.'
        : null
    })
  } catch (err) {
    console.error('Admin dashboard error:', err)
    res.status(500).send('Unable to load admin dashboard.')
  }
})

// POST delete user
router.post('/admin/delete/:id', requireAdmin, async (req, res) => {
  try {
    await deleteUser(req.params.id)
    return res.redirect('/admin/dashboard?deleted=1')
  } catch (err) {
    console.error('Delete user error:', err)
    return res.status(500).send('Unable to delete user.')
  }
})

// POST admin logout
router.post('/admin/logout', (req, res) => {
  delete req.session.isAdmin
  return res.redirect('/admin/login')
})

module.exports = router

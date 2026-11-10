
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const { getUserById } = require('../db/database')

const router = express.Router()

router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard')
  return res.redirect('/login')
})

router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.session.userId)

    if (!user) {
      req.session.destroy(() => {
        return res.redirect('/login')
      })
      return
    }

    res.render('dashboard', { user })
  } catch (err) {
    console.error('Dashboard error:', err)
    res.status(500).send('Unable to load dashboard.')
  }
})

router.get('/idthirdeye', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.session.userId)

    if (!user) {
      req.session.destroy(() => {
        return res.redirect('/login')
      })
      return
    }

    res.render('idthirdeye', {
  user,
  contactMessage: null,
  contactError: null
})
  } catch (err) {
    console.error('Page error:', err)
    res.status(500).send('Unable to load page.')
  }
})

module.exports = router

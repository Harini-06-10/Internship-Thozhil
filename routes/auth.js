
const express = require('express')
const bcrypt = require('bcryptjs')
const { createUser, getUserByEmail } = require('../db/database')

const router = express.Router()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---------- GET /register ----------
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard')

  res.render('register', {
    error: null,
    oldInput: {}
  })
})

// ---------- POST /register ----------
router.post('/register', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body
  const oldInput = { fullName, email }

  if (!fullName || !email || !password || !confirmPassword) {
    return res.render('register', {
      error: 'Fill in every field to continue.',
      oldInput
    })
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return res.render('register', {
      error: 'Enter a valid email address.',
      oldInput
    })
  }

  if (password.length < 8) {
    return res.render('register', {
      error: 'Password must be at least 8 characters.',
      oldInput
    })
  }

  if (password !== confirmPassword) {
    return res.render('register', {
      error: 'Passwords do not match.',
      oldInput
    })
  }

  try {
    const existing = await getUserByEmail(email)

    if (existing) {
      return res.render('register', {
        error: 'An account with that email already exists.',
        oldInput
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await createUser({
      fullName,
      email,
      passwordHash
    })

    req.session.userId = user.id
    req.session.fullName = user.full_name

    return res.redirect('/dashboard')

  } catch (err) {
    console.error('Registration error:', err)

    if (err.code === 11000) {
      return res.render('register', {
        error: 'An account with that email already exists.',
        oldInput
      })
    }

    return res.status(500).render('register', {
      error: 'Something went wrong. Try again.',
      oldInput
    })
  }
})

// ---------- GET /login ----------
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard')

  res.render('login', {
    error: null,
    oldInput: {}
  })
})

// ---------- POST /login ----------
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const oldInput = { email }

  if (!email || !password) {
    return res.render('login', {
      error: 'Enter your email and password.',
      oldInput
    })
  }

  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return res.render('login', {
        error: 'No account found with that email.',
        oldInput
      })
    }

    const matches = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!matches) {
      return res.render('login', {
        error: 'Incorrect password. Try again.',
        oldInput
      })
    }

    req.session.userId = user.id
    req.session.fullName = user.full_name

    const redirectTo = req.session.redirectTo || '/dashboard'
    delete req.session.redirectTo

    return res.redirect(redirectTo)

  } catch (err) {
    console.error('Login error:', err)

    return res.status(500).render('login', {
      error: 'Something went wrong. Try again.',
      oldInput
    })
  }
})

// ---------- POST /logout ----------
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).send('Unable to log out. Please try again.')
    }

    res.clearCookie('connect.sid')
    return res.redirect('/login')
  })
})

module.exports = router

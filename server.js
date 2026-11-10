
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo').MongoStore

const connectDB = require('./db/connect')
const { createContactMessage } = require('./db/database')

const authRoutes = require('./routes/auth')
const mainRoutes = require('./routes/main')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3000
const isVercel = Boolean(process.env.VERCEL)

app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('MongoDB connection error:', error)
    res.status(503).send('Database connection unavailable. Please try again.')
  }
})

// MongoDB session storage
app.use(session({
  name: 'idthirdeye.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: isVercel,
    sameSite: 'lax'
  }
}))

// Existing routes
app.use('/', authRoutes)
app.use('/', mainRoutes)
app.use('/', adminRoutes)

// Contact form submission
app.post('/contact', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login')
  }

  const { name, email, company, interest, message } = req.body

  if (!name || !email || !message || !message.trim()) {
    return res.status(400).send('Please fill in all required fields.')
  }

  try {
    await createContactMessage({
      userId: req.session.userId,
      name: name.trim(),
      email: email.trim(),
      company: company ? company.trim() : '',
      interest: interest || 'other',
      message: message.trim()
    })

    const user = await require('./db/User').findById(req.session.userId)

    if (!user) {
      return res.redirect('/login')
    }

    return res.render('idthirdeye', {
      user: {
        id: user._id.toString(),
        full_name: user.full_name,
        email: user.email
      },
      contactMessage: 'Your message has been sent successfully!',
      contactError: null
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).send('Unable to send your message. Please try again.')
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found. <a href="/">Go home</a>')
})

if (isVercel) {
  module.exports = app
} else {
  app.listen(PORT, () => {
    console.log(`idThirdeye app running at http://localhost:${PORT}`)
  })
}

// server.js
const path = require('path')
const express = require('express')
const session = require('express-session')

const authRoutes  = require('./routes/auth')
const mainRoutes  = require('./routes/main')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3000
const isVercel = Boolean(process.env.VERCEL)

// ---------- View engine ----------
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// ---------- Static files ----------
app.use(express.static(path.join(__dirname, 'public')))

// ---------- Body parsing ----------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ---------- Sessions ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'idthirdeye-student-project-secret-change-in-real-app',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: isVercel,
    },
  })
)

// ---------- Routes ----------
app.use('/', authRoutes)
app.use('/', mainRoutes)
app.use('/', adminRoutes)

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).send('Page not found. <a href="/">Go home</a>')
})

if (isVercel) {
  module.exports = app
} else {
  app.listen(PORT, () => {
    console.log(`idThirdeye app running at http://localhost:${PORT}`)
    console.log(`Admin panel:  http://localhost:${PORT}/admin/login`)
    console.log(`Admin email:  admin@idthirdeye.com`)
    console.log(`Admin pass:   Admin@1234`)
  })
}

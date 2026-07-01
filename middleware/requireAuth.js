// middleware/requireAuth.js
// Blocks access to a route unless the visitor has an active session.
// If not logged in, redirects to /login and remembers where they were headed.

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next()
  }
  req.session.redirectTo = req.originalUrl
  return res.redirect('/login')
}

module.exports = requireAuth

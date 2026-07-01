// middleware/requireAdmin.js
// Blocks access to admin routes unless the visitor has an active ADMIN session.
// Admin session is completely separate from regular user session.

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next()
  }
  req.session.adminRedirectTo = req.originalUrl
  return res.redirect('/admin/login')
}

module.exports = requireAdmin

// db/database.js
const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'app.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

function createUser({ fullName, email, passwordHash }) {
  const stmt = db.prepare(
    'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)'
  )
  const info = stmt.run(fullName, email.toLowerCase(), passwordHash)
  return getUserById(info.lastInsertRowid)
}

function getUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
  return stmt.get(email.toLowerCase())
}

function getUserById(id) {
  const stmt = db.prepare('SELECT id, full_name, email, created_at FROM users WHERE id = ?')
  return stmt.get(id)
}

function getAllUsers() {
  const stmt = db.prepare(
    'SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC'
  )
  return stmt.all()
}

function getTotalUserCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users')
  return stmt.get().count
}

function deleteUser(id) {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?')
  return stmt.run(id)
}

module.exports = {
  db,
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  getTotalUserCount,
  deleteUser,
}

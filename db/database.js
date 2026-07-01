// db/database.js
const Database = require('better-sqlite3')
const path = require('path')

const dbPath = process.env.VERCEL
  ? path.join('/tmp', 'app.db')
  : path.join(__dirname, 'app.db')
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

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    email TEXT,
    company TEXT,
    interest TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
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

function createContactMessage({ userId, name, email, company, interest, message }) {
  const stmt = db.prepare(
    'INSERT INTO contact_messages (user_id, name, email, company, interest, message) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const info = stmt.run(userId, name, email, company, interest, message)
  return getContactMessageById(info.lastInsertRowid)
}

function getContactMessageById(id) {
  const stmt = db.prepare(
    'SELECT id, user_id, name, email, company, interest, message, created_at FROM contact_messages WHERE id = ?'
  )
  return stmt.get(id)
}

function getAllContactMessages() {
  const stmt = db.prepare(
    'SELECT id, user_id, name, email, company, interest, message, created_at FROM contact_messages ORDER BY created_at DESC'
  )
  return stmt.all()
}

function getContactMessageCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM contact_messages')
  return stmt.get().count
}

function deleteContactMessage(id) {
  const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?')
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
  createContactMessage,
  getAllContactMessages,
  getContactMessageCount,
  deleteContactMessage,
}

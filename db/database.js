
const mongoose = require('mongoose')
const User = require('./User')
const ContactMessage = require('./ContactMessage')

// Format user data for the application
function formatUser(user) {
  if (!user) return null

  return {
    id: user._id.toString(),
    full_name: user.full_name,
    email: user.email,
    password_hash: user.password_hash,
    created_at: user.created_at
  }
}

// Format contact message data
function formatMessage(msg) {
  if (!msg) return null

  return {
    id: msg._id.toString(),
    user_id: msg.user_id,
    name: msg.name,
    email: msg.email,
    company: msg.company,
    interest: msg.interest,
    message: msg.message,
    created_at: msg.created_at
  }
}

// USER FUNCTIONS

async function createUser({ fullName, email, passwordHash }) {
  const user = await User.create({
    full_name: fullName,
    email: email.toLowerCase().trim(),
    password_hash: passwordHash
  })

  return formatUser(user)
}

async function getUserByEmail(email) {
  const user = await User.findOne({
    email: email.toLowerCase().trim()
  })

  return formatUser(user)
}

async function getUserById(id) {
  if (!mongoose.isValidObjectId(id)) return null

  const user = await User.findById(id)
  return formatUser(user)
}

async function getAllUsers() {
  const users = await User.find()
    .sort({ created_at: -1 })
    .select('-password_hash')

  return users.map(user => ({
    id: user._id.toString(),
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at
  }))
}

async function getTotalUserCount() {
  return User.countDocuments()
}

async function deleteUser(id) {
  if (!mongoose.isValidObjectId(id)) return null

  return User.deleteOne({ _id: id })
}

// CONTACT MESSAGE FUNCTIONS

async function createContactMessage({
  userId,
  name,
  email,
  company,
  interest,
  message
}) {
  const contact = await ContactMessage.create({
    user_id: userId || null,
    name,
    email,
    company,
    interest,
    message
  })

  return formatMessage(contact)
}

async function getContactMessageById(id) {
  if (!mongoose.isValidObjectId(id)) return null

  const contact = await ContactMessage.findById(id)
  return formatMessage(contact)
}

async function getAllContactMessages() {
  const messages = await ContactMessage.find()
    .sort({ created_at: -1 })

  return messages.map(formatMessage)
}

async function getContactMessageCount() {
  return ContactMessage.countDocuments()
}

async function deleteContactMessage(id) {
  if (!mongoose.isValidObjectId(id)) return null

  return ContactMessage.deleteOne({ _id: id })
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  getTotalUserCount,
  deleteUser,
  createContactMessage,
  getContactMessageById,
  getAllContactMessages,
  getContactMessageCount,
  deleteContactMessage
}

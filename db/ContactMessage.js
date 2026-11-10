
const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  interest: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model(
  'ContactMessage',
  contactMessageSchema
)

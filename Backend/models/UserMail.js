import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'image', 'document'],
    required: true
  },
  url: {
    type: String, // URL to stored file
    required: true
  },
  mimeType: {
    type: String,
    required: true
  }
});

const userMailSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  sender: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  preview: {
    type: String,
    required: true
  },
  attachments: [attachmentSchema],
  isAutomated: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    required: true // Google user ID
  },
  conversationId: {
    type: String,
    required: true // To group related emails
  },
  parentMessageId: {
    type: String,
    default: null // For replies
  },
  messageType: {
    type: String,
    enum: ['sent', 'received', 'draft'],
    default: 'sent'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
userMailSchema.index({ userId: 1, sentAt: -1 });
userMailSchema.index({ conversationId: 1, sentAt: 1 });
userMailSchema.index({ senderEmail: 1, recipientEmail: 1 });

export default mongoose.model('UserMail', userMailSchema);
import mongoose from 'mongoose';

const userListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  listType: {
    type: String,
    required: true,
    enum: ['prospects-q1', 'conference-attendees', 'newsletter-subscribers', 'webinar-leads'],
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  position: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
userListSchema.index({ userId: 1, listType: 1 });

// Ensure unique email per user per list type
userListSchema.index({ userId: 1, listType: 1, email: 1 }, { unique: true });

export default mongoose.model('UserList', userListSchema);
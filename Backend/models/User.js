
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  googleId: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  picture: String,
  googleAccessToken: String,
  googleRefreshToken: String,
  lastLogin: Date,
  profileType: { type: String, enum: ['organization', 'individual'], default: null },
  profileCompleted: { type: Boolean, default: false },
  profileDetails: { type: Schema.Types.Mixed, default: {} },
});

export default mongoose.models.User || model('User', UserSchema);

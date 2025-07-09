import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import fetch from 'node-fetch';
import User from './models/User.js';

dotenv.config();
const app = express();
app.use(cors(), express.json());

// MongoDB Atlas connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error);
  }
};

connectToDB();

app.post('/auth/google', async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: 'Missing access_token' });

    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const userInfo = await googleRes.json();

    const { sub: googleId, name, email, picture } = userInfo;

    if (!googleId || !email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, name, email, picture });
    }

    const token = jwt.sign({ id: user._id, googleId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      profileCompleted: user.profileCompleted,
      hasSelectedProfileType: !!user.profileDetails?.type,
    });
  } catch (err) {
    console.error('Error during Google auth:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/user/profile', async (req, res) => {
  try {
    const { token, profileDetails, complete } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updateFields = { profileDetails };
    if (complete) {
      updateFields.profileCompleted = true;
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateFields,
      { new: true }
    );

    res.json({ success: true, profileCompleted: user.profileCompleted });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

app.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send();

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).lean();
    if (!user) return res.status(404).send();

    res.json({
      profileType: user.profileType,             // new field
      profileDetails: user.profileDetails || {},
      profileCompleted: user.profileCompleted,
    });
  } catch (err) {
    res.status(401).send();
  }
});

app.post('/user/type', async (req, res) => {
  const { token, profileType } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByIdAndUpdate(
    decoded.id,
    { profileType },
    { new: true }
  );
  res.json({ success: true, profileType: user.profileType });
});

app.listen(4000, () => console.log('🚀 Server running on port 4000'));

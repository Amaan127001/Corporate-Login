import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import fetch from 'node-fetch';
import User from './models/User.js';
import UserList from './models/UserList.js';

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

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Existing routes
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
      profileType: user.profileType,
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

// NEW ROUTES FOR LISTS FUNCTIONALITY

// Get all lists with member counts for the authenticated user
app.get('/lists', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Define the four list types
    const listTypes = [
      { id: 'prospects-q1', name: 'Q1 Prospects' },
      { id: 'conference-attendees', name: 'Conference Attendees' },
      { id: 'newsletter-subscribers', name: 'Newsletter Subscribers' },
      { id: 'webinar-leads', name: 'Webinar Leads' }
    ];

    // Get member counts for each list type
    const listsWithCounts = await Promise.all(
      listTypes.map(async (listType) => {
        const memberCount = await UserList.countDocuments({
          userId: userId,
          listType: listType.id
        });
        
        return {
          id: listType.id,
          name: listType.name,
          memberCount: memberCount
        };
      })
    );

    res.json(listsWithCounts);
  } catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
});

// Get members of a specific list
app.get('/lists/:listId/members', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = req.params.listId;
    
    const members = await UserList.find({
      userId: userId,
      listType: listId
    }).select('-userId -__v').sort({ createdAt: -1 });

    res.json(members);
  } catch (err) {
    console.error('Error fetching list members:', err);
    res.status(500).json({ error: 'Failed to fetch list members' });
  }
});

// Add a new member to a list
app.post('/lists/:listId/members', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = req.params.listId;
    const { fullName, email, linkedin, company, position, avatar } = req.body;

    // Generate avatar if not provided
    let finalAvatar = avatar;
    if (!avatar && fullName) {
      const initials = fullName.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
      finalAvatar = `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }

    // Create new member
    const newMember = new UserList({
      userId: userId,
      listType: listId,
      fullName: fullName || 'New Member',
      email: email || `${Date.now()}@example.com`,
      linkedin: linkedin || '',
      company: company || 'Unknown Company',
      position: position || 'Unknown Position',
      avatar: finalAvatar
    });

    await newMember.save();
    
    // Return the new member
    res.status(201).json({
      id: newMember._id,
      ...newMember.toObject()
    });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Update a member
app.put('/lists/:listId/members/:memberId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = req.params.listId;
    const memberId = req.params.memberId;
    const { fullName, email, linkedin, company, position, avatar } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    // Check if member exists and belongs to the user
    const member = await UserList.findOne({
      _id: memberId,
      userId: userId,
      listType: listId
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if email is being changed and if it conflicts with existing member
    if (email !== member.email) {
      const existingMember = await UserList.findOne({
        userId: userId,
        listType: listId,
        email: email,
        _id: { $ne: memberId }
      });

      if (existingMember) {
        return res.status(400).json({ error: 'Member with this email already exists in the list' });
      }
    }

    // Update member
    const updatedMember = await UserList.findByIdAndUpdate(
      memberId,
      {
        fullName,
        email,
        linkedin: linkedin || '',
        company: company || '',
        position: position || '',
        avatar: avatar || member.avatar
      },
      { new: true }
    );

    const memberResponse = {
      id: updatedMember._id,
      fullName: updatedMember.fullName,
      email: updatedMember.email,
      linkedin: updatedMember.linkedin,
      company: updatedMember.company,
      position: updatedMember.position,
      avatar: updatedMember.avatar
    };

    res.json(memberResponse);
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Delete a member
app.delete('/lists/:listId/members/:memberId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const listId = req.params.listId;
    const memberId = req.params.memberId;

    // Check if member exists and belongs to the user
    const member = await UserList.findOne({
      _id: memberId,
      userId: userId,
      listType: listId
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Delete member
    await UserList.findByIdAndDelete(memberId);
    
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

app.listen(4000, () => console.log('🚀 Server running on port 4000'));
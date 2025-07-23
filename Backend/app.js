import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import fetch from 'node-fetch';
import User from './models/User.js';
import UserList from './models/UserList.js';
import UserMail from './models/UserMail.js';
import { format } from 'date-fns';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();

const allowedFrontend = "https://ingeniumai.netlify.app";
app.use(cors({
  origin: allowedFrontend,
  credentials: true
}), express.json());

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

app.post('/auth/google', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing authorization code' });

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const { id_token } = tokens;

    // Verify ID token to get user info
    const ticket = await oauth2Client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;

    // EARLY EMAIL DOMAIN CHECK
    const personalDomains = ['@gmail.com', '@yahoo.com', '@outlook.com'];
    const isPersonal = personalDomains.some(domain => email.endsWith(domain));

    if (isPersonal) {
      return res.status(403).json({
        error: 'Personal email not allowed',
        message: 'Please use a corporate or institutional email'
      });
    }

    // Proceed only with non-personal emails
    let user = await User.findOne({ googleId });
    const userData = {
      googleId,
      name,
      email,
      picture,
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
      lastLogin: new Date()
    };

    if (!user) {
      user = await User.create(userData);
    } else {
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.googleAccessToken = tokens.access_token;
      if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: { name, email, picture },
      token,
      profileCompleted: user.profileCompleted,
      hasSelectedProfileType: !!user.profileDetails?.type
    });

  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.googleRefreshToken) {
      return res.status(400).json({ error: 'Invalid user or missing refresh token' });
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    user.googleAccessToken = credentials.access_token;
    await user.save();

    res.json({ access_token: credentials.access_token });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Failed to refresh token' });
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

// Create reusable transporter object using Gmail API
const getTransporterForUser = async (userId) => {
  const user = await User.findById(userId);

  // Change from gmailRefreshToken to googleRefreshToken
  if (!user || !user.googleRefreshToken) {
    throw new Error('User not authenticated with Gmail');
  }


  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: user.googleRefreshToken
  });

  const accessToken = await oauth2Client.getAccessToken();

  // Verify token has required scope
  const tokenInfo = await oauth2Client.getTokenInfo(accessToken.token);
  if (!tokenInfo.scopes.includes('https://www.googleapis.com/auth/gmail.send')) {
    throw new Error('Missing required Gmail scope');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: user.email,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: user.googleRefreshToken,
      accessToken: accessToken.token
    }
  });
};


// GET user's emails
app.get('/api/mail', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get both sent and received emails
    const emails = await UserMail.find({
      $or: [
        { senderEmail: user.email },
        { recipientEmail: user.email }
      ]
    }).sort({ sentAt: -1 });

    res.json(emails);
  } catch (err) {
    console.error('Error fetching emails:', err);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// POST send new email
app.post('/api/mail/send', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { recipientEmail, subject, content, attachments = [] } = req.body;

    // Create email in database
    const id = new mongoose.Types.ObjectId().toString();
    const newMail = new UserMail({
      id,
      sender: user.name,
      senderEmail: user.email,
      recipient: recipientEmail,
      recipientEmail,
      subject,
      content,
      preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      attachments,
      userId: user.googleId,
      conversationId: new mongoose.Types.ObjectId().toString(),
      messageType: 'sent',
      status: 'sent',
      avatar: user.picture,
      sentAt: new Date()
    });

    await newMail.save();

    try {
      // Get user-specific transporter
      const transporter = await getTransporterForUser(req.user.id);

      // Send email via Gmail
      const mailOptions = {
        from: `"${user.name}" <${user.email}>`,
        to: recipientEmail,
        subject: subject,
        html: content,
        attachments: attachments.map(att => ({
          filename: att.name,
          path: `${__dirname}/${att.url.replace('/uploads/', 'uploads/')}`
        }))
      };

      await transporter.sendMail(mailOptions);

    } catch (sendError) {
      // If token expired, refresh and try again
      if (sendError.code === 401) {
        console.log('Refreshing access token...');

        // Refresh token
        const oauth2Client = new OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
          refresh_token: user.googleRefreshToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        user.googleAccessToken = credentials.access_token;
        await user.save();

        // Create new transporter with refreshed token
        const newTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: user.email,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: user.googleRefreshToken,
            accessToken: credentials.access_token
          }
        });

        await newTransporter.sendMail(mailOptions);
      } else {
        throw sendError;
      }
    }
    res.status(201).json(newMail);
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// POST reply to email
app.post('/api/mail/reply', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { originalId, content, attachments = [] } = req.body;
    const originalMail = await UserMail.findById(originalId);
    if (!originalMail) return res.status(404).json({ error: 'Original email not found' });

    // Create reply in database
    const id = new mongoose.Types.ObjectId().toString();
    const replyMail = new UserMail({
      id,
      sender: user.name,
      senderEmail: user.email,
      recipient: originalMail.sender,
      recipientEmail: originalMail.senderEmail,
      subject: `Re: ${originalMail.subject}`,
      content,
      preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      attachments,
      userId: user.googleId,
      conversationId: originalMail.conversationId,
      parentMessageId: originalMail.id,
      messageType: 'sent',
      status: 'sent',
      avatar: user.picture,
      sentAt: new Date()
    });

    await replyMail.save();

    // Get user-specific transporter
    const transporter = await getTransporterForUser(req.user.id);

    // Send email via Gmail
    const mailOptions = {
      from: `"${user.name}" <${user.email}>`,
      to: originalMail.senderEmail,
      subject: `Re: ${originalMail.subject}`,
      html: content,
      attachments: attachments.map(att => ({
        filename: att.name,
        path: `${__dirname}/${att.url.replace('/uploads/', 'uploads/')}`
      }))
    };

    await transporter.sendMail(mailOptions);

    // Mark original as read
    await UserMail.findByIdAndUpdate(originalId, {
      isRead: true,
      readAt: new Date()
    });

    res.status(201).json(replyMail);
  } catch (err) {
    console.error('Error replying to email:', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// PUT mark email as read
app.put('/api/mail/:id/read', authenticateToken, async (req, res) => {
  try {
    await UserMail.findByIdAndUpdate(req.params.id, {
      isRead: true,
      readAt: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// POST upload attachment
// const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// POST /api/upload endpoint
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  const fileSize = file.size;

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to determine file type
  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    return 'document';
  };

  res.json({
    id: new mongoose.Types.ObjectId().toString(),
    name: file.originalname,
    size: formatFileSize(file.size),
    type: getFileType(file.originalname),
    url: `/uploads/${file.filename}`,
    mimeType: file.mimetype
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(4000, () => console.log('🚀 Server running on port 4000'));
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const logger = require('../utils/logger');


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await db.query(
      'SELECT user_id, email, first_name, last_name, phone_number, profile_picture, role_id, created_at FROM users WHERE user_id = ?',
      [userId]
    );

    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user[0]
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};


exports.updateProfile = async (req, res) => {
  const { firstName, lastName, phoneNumber, profilePicture } = req.body;
  const userId = req.user.user_id;

  try {
    // Construct dynamic query for partial updates
    let updateFields = [];
    let values = [];

    if (firstName) {
      updateFields.push("first_name = ?");
      values.push(firstName);
    }
    if (lastName) {
      updateFields.push("last_name = ?");
      values.push(lastName);
    }
    if (phoneNumber) {
      updateFields.push("phone_number = ?");
      values.push(phoneNumber);
    }
    if (profilePicture) {
      updateFields.push("profile_picture = ?");
      values.push(profilePicture);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;

    await db.query(query, values);

    res.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({ error: "Server error while updating profile" });
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Set account to inactive rather than delete
    await db.query(
      'UPDATE users SET is_active = FALSE WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error while deleting account' });
  }
};

exports.getNotifications = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const notifications = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error while fetching notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  const userId = req.user.user_id;
  const notificationId = req.params.id;

  try {
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?',
      [notificationId, userId]
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Server error while updating notification' });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.user_id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  try {
    // Fetch the user's current hashed password
    const users = await db.query('SELECT password_hash as password FROM users WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update the password in the database
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, userId]);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    res.status(500).json({ error: 'Error changing password', details: error.message });
  }
};

exports.setRsvp = async (req, res) => {
  try {
    // Check if couple profile exists
    const { firstName, lastName, email, phoneNumber, address='', relationship='', plusOnes=0, status = 'no', dietaryRestrictions = '', additionalNotes = '', coupleId } = req.body;
    const result = await db.query(
      'INSERT INTO rsvps (first_name, last_name, email, phone_number, address, relationship, plus_ones, status, dietary_restrictions, additional_notes, couple_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, phoneNumber, address, relationship, plusOnes, status, dietaryRestrictions, additionalNotes, coupleId]
    );

    res.status(201).json({
      success: true,
      message: 'Rsvp created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    logger.error('Set rsvp error:', error);
    res.status(500).json({ error: 'Server error while creating rsvp' });
  }
};

exports.getRsvp = async (req, res) => {
  try {
    const userId = req.user.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }
    const user = await db.query(
      `SELECT first_name, last_name, email, address, relationship, plus_ones, 
        status, dietary_restrictions dietaryRestrictions, additional_notes FROM rsvps 
        WHERE couple_id = ?`,
      [userId]
    );

    if (!user.length) {
      return res.status(404).json({ error: 'Rsvp not found' });
    }

    res.json({
      success: true,
      user: user[0]
    });
  } catch (error) {
    logger.error('Get rsvp error:', error);
    res.status(500).json({ error: 'Server error while fetching rsvp' });
  }
};

exports.contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, weddingDate, service, message } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Build query fields and values based on what's provided in req.body
    const fields = ['first_name', 'last_name', 'email', 'message'];
    const values = [firstName, lastName, email, message];

    if (phoneNumber) {
      fields.push('phone_number');
      values.push(phoneNumber);
    }

    if (weddingDate) {
      fields.push('wedding_date'); 
      values.push(weddingDate);
    }

    if (service) {
      fields.push('service');
      values.push(service);
    }

    const query = `INSERT INTO contact_us (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
    
    const result = await db.query(query, values);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully'
    });
  } catch (error) {
    logger.error('Contact us error:', error);
    res.status(500).json({ error: 'Server error while sending message' });
  }
};

exports.setUserReviews = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { vendorId, plannerId, rating, comment='' } = req.body;
    const [user] = await db.query('SELECT email, first_name, last_name FROM users WHERE user_id = ?', [userId]);
    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!vendorId && !plannerId) {  
      return res.status(400).json({ error: 'Vendor or planner ID is required' });
    }
    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    // Build query fields and values based on what's provided in req.body
    const fields = ['first_name', 'last_name', 'email', 'comment', 'rating', 'user_id'];
    const values = [user.first_name, user.last_name, user.email, comment, rating, userId];

    if (vendorId) {
      fields.push('vendor_id');
      values.push(vendorId);
    }

    if (plannerId) {
      fields.push('planner_id'); 
      values.push(plannerId);
    }

    const query = `INSERT INTO reviews (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
    
    const result = await db.query(query, values);
    

    res.status(201).json({
      success: true,
      message: 'Review created successfully'
    });
  } catch (error) {
    logger.error('Set user reviews error:', error);
    res.status(500).json({ error: 'Server error while setting user reviews' });
  }
};

exports.getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const reviews = await db.query('SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);
    if(reviews.length === 0) {
      return res.json({ success: true, reviews: [], rating: 0 });
    }
    const rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    res.json({ success: true, reviews, rating });
  } catch (error) {
    logger.error('Get vendor reviews error:', error);
    res.status(500).json({ error: 'Server error while fetching vendor reviews' });
  }
};

exports.getPlannerReviews = async (req, res) => {
  try {
    const plannerId = req.params.plannerId;
    const reviews = await db.query('SELECT * FROM reviews WHERE planner_id = ? ORDER BY created_at DESC', [plannerId]);
    if(reviews.length === 0) {
      return res.json({ success: true, reviews: [], rating: 0 });
    }
    const rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    res.json({ success: true, reviews, rating });
  } catch (error) {
    logger.error('Get planner reviews error:', error);
    res.status(500).json({ error: 'Server error while fetching planner reviews' });
  }
};







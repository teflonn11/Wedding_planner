const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../utils/logger');
const emailer = require('../utils/emailer');

exports.register = async (req, res) => {
  const { email, password, firstName, lastName, roleId, phoneNumber, gender } = req.body;
  try {
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role_id, phone_number, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, roleId, phoneNumber, gender.toLowerCase()]
    );
    let roleName = '';
    switch (roleId) {
      case 1:
        roleName = 'Couple';
        break;
      case 2:
        roleName = 'Vendor';
        break;
      case 3:
        roleName = 'Planner';
        break;
      default:
        roleName = 'Couple';
    }

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertId, role: roleId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const emailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to <b>The Dream Wedding Co.</b></title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f8f6f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #b8732e;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
          }
          .content h2 {
            color: #b8732e;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #b8732e;
            color: #ffffff !important;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 20px;
          }
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
          ul {
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to The Dream Wedding Co. 💍</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName} ${lastName},</h2>
            <p>We're absolutely thrilled to have you on board as a <b>${roleName}</b>!</p>
            <p>
              Start your journey toward the perfect wedding with a few clicks:
            </p>

            <p style="margin-top: 30px;">
              credentials are:
            </p>
            <ul>
              <li><b>Email:</b> ${email}</li>
              <li><b>Password:</b> ${password}</li>
            </ul>

            <a href="${process.env.FRONTEND_URL}" class="cta-button">Get Started</a>

            <p style="margin-top: 30px;">Have questions? Our team is always here to help!</p>
          </div>
          <div class="footer">
            ❤️ Team The Dream Wedding Co. <br />
            📧 support@dreamwedding.co | 🌐 www.dreamwedding.co
          </div>
        </div>
      </body>
    </html>
    `;
    const emailRes = await emailer.sendMail(email, 'OnboarWelcome to The Dream Wedding Co. – Let’s Start Planning Your Dream Wedding 💍', emailContent)
    console.log('Email sent:', emailRes);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        roleId
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

    // Generate JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: user.role_id
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.logout = (req, res) => {
  // JWT is stateless, so we just send success response
  // Client should remove the token from storage
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Generate new token
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24); // Token expires in 24 hour

    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
      [resetToken, expiryTime, user.user_id]
    );
    const RESET_LINK = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  margin: auto;
              }
              .button {
                  display: inline-block;
                  background: #b8732e;
                  color: #ffffff !important;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
                  margin-top: 20px;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              <p>
                  <a href="${RESET_LINK}" class="button">Reset Password</a>
              </p>
              <p>If you did not request this, please ignore this email.</p>
              <div class="footer">
                  <p>&copy; 2025 The Dream Wedding Co. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    const emailRes = await emailer.sendMail(user.email, 'Password Reset Request', emailContent)
    console.log('Email sent:', emailRes);

    res.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error during password reset request' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    console.log(token, newPassword)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, decoded.userId]
    );

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
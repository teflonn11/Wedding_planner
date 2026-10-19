const { format } = require('date-fns');
const db = require('../config/database');
const logger = require('../utils/logger');
const emailer = require('../utils/emailer');

exports.getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    let couples = await db.query(
      `SELECT u.first_name firstName, u.last_name lastName, u.email, u.phone_number phoneNumber, u.gender, c.couple_id coupleId, c.user_id userId, c.partner_name as partnerName, c.start_date startDate, c.end_date endDate, c.location, c.guest_count guestCount, c.total_budget totalBudget, c.theme, c.color_scheme colorScheme, c.services, c.additional_notes additionalNotes FROM users u
      LEFT JOIN couples c ON u.user_id = c.user_id 
      WHERE u.user_id = ?`,
      [userId]
    );

    
    if (couples.length === 0) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    couples = couples.map(couple => ({
      ...couple,
      startDate: couple.startDate ? format(new Date(couple.startDate), 'yyyy-MM-dd') : '',
      endDate: couple.endDate ? format(new Date(couple.endDate), 'yyyy-MM-dd') : ''
    }));

    res.json({
      success: true,
      profile: couples[0]
    });
  } catch (error) {
    logger.error('Get couple profile error:', error);
    res.status(500).json({ error: 'Server error while fetching couple profile' });
  }
};

exports.createProfile = async (req, res) => {
  const userId = req.user.user_id;

  const { partnerName, startDate, endDate, location, guestCount, totalBudget, theme, colorScheme, services = [], additionalNotes } = req.body;
  try {
    // Check if profile already exists
    const existingProfile = await db.query('SELECT * FROM couples WHERE user_id = ?', [userId]);

    if (existingProfile.length > 0) {
      return res.status(400).json({ error: 'Couple profile already exists' });
    }

    // Create profile
    const result = await db.query(
      'INSERT INTO couples (user_id, partner_name, start_date, end_date, location, guest_count, total_budget, theme, color_scheme, services, additional_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, partnerName, format(new Date(startDate), 'yyyy-MM-dd'), format(new Date(endDate), 'yyyy-MM-dd'), location, guestCount, totalBudget, theme, colorScheme, services, additionalNotes]
    );

    const coupleId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Couple profile created successfully',
      coupleId
    });
  } catch (error) {
    logger.error('Create couple profile error:', error);
    res.status(500).json({ error: 'Server error while creating couple profile' });
  }
};


exports.updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { firstName, lastName, email, phoneNumber, gender, partnerName, startDate, endDate, location, guestCount, totalBudget, theme, colorScheme, services = [], additionalNotes } = req.body;

  try {
    // Get couple ID
    const [couples] = await db.query("SELECT couple_id FROM couples WHERE user_id = ?", [userId]);
    if (!couples) {
      return res.status(404).json({ error: "Couple profile not found" });
    }

    // Construct dynamic query for PATCH (only update provided fields)
    let updateFields = [];
    let values = [];

    if (partnerName !== undefined) {
      updateFields.push("partner_name = ?");
      values.push(partnerName);
    }
    if (startDate !== undefined) {
      updateFields.push("start_date = ?");
      // values.push(startDate);
      values.push(format(new Date(startDate), 'yyyy-MM-dd'));
    }
    if (endDate !== undefined) {
      updateFields.push("end_date = ?");
      values.push(format(new Date(endDate), 'yyyy-MM-dd'));
    }
    if (location !== undefined) {
      updateFields.push("location = ?");
      values.push(location);
    }
    if (guestCount !== undefined) {
      updateFields.push("guest_count = ?");
      values.push(guestCount);
    }
    if (totalBudget !== undefined) {
      updateFields.push("total_budget = ?");
      values.push(totalBudget);
    }
    if (theme !== undefined) {
      updateFields.push("theme = ?");
      values.push(theme);
    }
    if (colorScheme !== undefined) {
      updateFields.push("color_scheme = ?");
      values.push(colorScheme);
    }
    if (services !== undefined && services.length > 0) {
      updateFields.push("services = ?");
      values.push(services);
    }
    if (additionalNotes !== undefined) {
      updateFields.push("additional_notes = ?");
      values.push(additionalNotes);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    values.push(userId);
    const query = `UPDATE couples SET ${updateFields.join(", ")} WHERE user_id = ?`;

    await db.query(query, values);


    updateFields = [];
    values = [];

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

    // if (updateFields.length === 0) {
    //   return res.status(400).json({ error: "No fields provided for update" });
    // }

    values.push(userId);
    if (values.length > 1) {
      const user_query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;

      await db.query(user_query, values);
    }


    res.json({
      success: true,
      message: "Couple profile updated successfully"
    });
  } catch (error) {
    logger.error("Update couple profile error:", error);
    res.status(500).json({ error: "Server error while updating couple profile" });
  }
};

exports.sendRsvpEmail = async (req, res) => {
  const userId = req.user.user_id;

  const { emails= [] } = req.body;
  try {
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    // Check if couple profile exists
    const [couple] = await db.query("SELECT start_date, end_date, location FROM couples WHERE user_id = ?", [userId]);
    if (!couple) {
      return res.status(404).json({ error: "Couple profile not found" });
    }
    const RSVP_LINK = `${process.env.FRONTEND_URL}/rsvp?cu=${userId}`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RSVP Invitation</title>
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
                  text-align: center;
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
              <h2>You're Invited!</h2>
              <p>We would love for you to join us for our <strong>wedding</strong> on <strong>${couple.start_date}</strong> at <strong>${couple.location}</strong>.</p>
              <p>Please confirm your attendance by clicking the button below:</p>
              <p>
                  <a href="${RSVP_LINK}" class="button">RSVP Now</a>
              </p>
              <p>If you are unable to attend, kindly let us know.</p>
              <div class="footer">
                  <p>&copy; 2025 The Dream Wedding Co. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    const emailRes = await emailer.sendBulkEmail(emails, "You're Invited: Please RSVP for marriage", emailContent)
    console.log('Email sent:', emailRes);

    res.json({
      success: true,
      message: 'RSVP email sent successfully',
    });
  } catch (error) {
    logger.error('Sending RSVP email error:', error);
    res.status(500).json({ error: 'Server error while sending RSVP email' });
  }
};

// Send OTP email
exports.sendOTP = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [user] = await db.query("SELECT email FROM users WHERE user_id = ?", [userId]);
    if (!user) {
      return res.status(404).json({ error: "Invalid User" });
    }
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
          }
          .container {
            max-width: 500px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            margin: auto;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          .otp {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            letter-spacing: 8px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your One-Time Password (OTP)</h2>
          <p>Use the following OTP to complete your verification process:</p>
          <div class="otp">${OTP}</div>
          <p>This code is valid for the next 10 minutes. Please do not share it with anyone.</p>
          <div class="footer">
            <p>&copy; 2025 The Dream Wedding Co.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const emailRes = await emailer.sendMail(user.email, 'Your One-Time Password (OTP)', emailContent)
    console.log('Email sent:', emailRes);
    res.json({
      success: true,
      otp: OTP,
      message: "OTP sent successfully"
    });
  } catch (error) {
    logger.error('Sending OTP email error:', error);
    res.status(500).json({ error: 'Server error while sending OTP email' });
  }
}
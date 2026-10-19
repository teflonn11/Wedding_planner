const { format } = require('date-fns');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const logger = require('../utils/logger');
const { setVendorAvailability } = require('../services/vendorService');
const { error } = require('winston');

exports.getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    let vendors = await db.query(
      `SELECT u.first_name firstName, u.last_name lastName, u.email, u.phone_number phoneNumber, u.gender, va.start_date startDate, va.end_date endDate, v.vendor_id vendorId, v.user_id userId, v.business_name businessName, v.category_id categoryId, v.description, v.website, v.location, v.rating, v.base_price basePrice, v.duration_hours durationHours, v.services  FROM users u
        LEFT JOIN vendors v ON u.user_id = v.user_id
        LEFT JOIN vendor_availability va ON v.vendor_id = va.vendor_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (vendors.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    vendors = vendors.map(vendor => ({
      ...vendor,
      startDate: vendor.startDate ? format(new Date(vendor.startDate), 'yyyy-MM-dd') : '',
      endDate: vendor.endDate ? format(new Date(vendor.endDate), 'yyyy-MM-dd') : ''
    }));

    res.json({
      success: true,
      profile: vendors[0]
    });
  } catch (error) {
    logger.error('Get vendor profile error:', error);
    res.status(500).json({ error: 'Server error while fetching vendor profile' });
  }
};

exports.createProfile = async (req, res) => {
  const userId = req.user.user_id;
  const { businessName, categoryId, description, website, location, services, basePrice, startDate, endDate, durationHours } = req.body;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'fail',
        error: 'Date, start date, and end date are required'
      });
    }

    // Validate time format
    if (startDate >= endDate) {
      return res.status(400).json({
        status: 'fail',
        error: 'Start date must be before end date'
      });
    }
    // Check if vendor profile already exists
    const existingVendor = await db.query('SELECT * FROM vendors WHERE user_id = ?', [userId]);

    if (existingVendor.length > 0) {
      return res.status(400).json({ error: 'Vendor profile already exists' });
    }
    // Create vendor profile
    const result = await db.query(
      'INSERT INTO vendors (user_id, business_name, category_id, description, website, location, services, base_price, duration_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, businessName, categoryId, description, website, location, services, basePrice, durationHours]
    );
    await setVendorAvailability(startDate, endDate, result.insertId);

    res.status(201).json({
      success: true,
      message: 'Vendor profile created successfully',
      vendorId: result.insertId
    });
  } catch (error) {
    logger.error('Create vendor profile error:', error);
    res.status(500).json({ error: 'Server error while creating vendor profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.user_id;
  // const { businessName, description, website, location, services, basePrice } = req.body;
  const { firstName, lastName, email, phoneNumber, gender, businessName, categoryId, description, website, location, services, basePrice, startDate, endDate, durationHours } = req.body;

  try {
    const [vendor] = await db.query("SELECT vendor_id FROM vendors WHERE user_id = ?", [userId]);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }

    // Construct dynamic query for PATCH (only update provided fields)
    let updateFields = [];
    let values = [];

    if (businessName !== undefined) {
      updateFields.push("business_name = ?");
      values.push(businessName);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      values.push(description);
    }
    if (website !== undefined) {
      updateFields.push("website = ?");
      values.push(website);
    }
    if (location !== undefined) {
      updateFields.push("location = ?");
      values.push(location);
    }
    if (services !== undefined) {
      updateFields.push("services = ?");
      values.push(services);
    }
    if (basePrice !== undefined) {
      updateFields.push("base_price = ?");
      values.push(basePrice);
    }
    if (categoryId !== undefined) {
      updateFields.push("category_id = ?");
      values.push(categoryId);
    }
    if (durationHours !== undefined) {
      updateFields.push("duration_hours = ?");
      values.push(durationHours);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    values.push(userId);
    const query = `UPDATE vendors SET ${updateFields.join(", ")} WHERE user_id = ?`;

    data = await db.query(query, values);

    updateFields = [];
    values = [];
    if (startDate !== undefined) {
      updateFields.push("start_date = ?");
      values.push(startDate);
    }
    if (endDate !== undefined) {
      updateFields.push("end_date = ?");
      values.push(endDate);
    }

    values.push(vendor.vendor_id);
    if (values.length > 1) {
      const availability_query = `UPDATE vendor_availability SET ${updateFields.join(", ")} WHERE vendor_id = ?`;
      await db.query(availability_query, values);
    }


    updateFields = [];
    values = [];
    if (firstName !== undefined) {
      updateFields.push("first_name = ?");
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updateFields.push("last_name = ?");
      values.push(lastName);
    }
    if (phoneNumber !== undefined) {
      updateFields.push("phone_number = ?");
      values.push(phoneNumber);
    }
    if (gender !== undefined) {
      updateFields.push("gender = ?");
      values.push(gender);
    }
    values.push(userId);
    if (values.length > 1) {
      const user_query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;
      await db.query(user_query, values);
    }

    res.json({
      success: true,
      message: "Vendor profile updated successfully"
    });
  } catch (error) {
    logger.error("Update vendor profile error:", error);
    res.status(500).json({ error: "Server error while updating vendor profile" });
  }
};

// Public routes for listing vendors
exports.listVendors = async (req, res) => {
  const userId = req.user.user_id;
  const { category, location, minRating, search, services } = req.query;

  try {
    const [couple] = await db.query("SELECT start_date, end_date, total_budget, services FROM couples WHERE user_id = ?", [userId]);
    if (!couple) {
      return res.status(404).json({ error: "Invalid User" });
    }
    let query = `
        SELECT v.vendor_id vendorId, v.business_name as businessName, v.location, ROUND(AVG(r.rating), 1) AS rating, v.services, v.base_price basePrice, v.description, vc.category_name as categoryName 
        FROM vendors v
        JOIN categories vc ON v.category_id = vc.category_id
        JOIN vendor_availability va ON v.vendor_id = va.vendor_id
        LEFT JOIN reviews r ON v.vendor_id = r.vendor_id
        WHERE 1=1
      `;
    const params = [];

    if (category) {
      query += ' AND v.category_id = ?';
      params.push(category);
    }

    if (location) {
      query += ' AND v.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (minRating) {
      query += ' AND v.rating >= ?';
      params.push(minRating);
    }

    if (search) {
      query += ' AND (v.business_name LIKE ? OR v.services LIKE ?)';
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    if (couple.total_budget) {
      query += ` AND v.base_price <= ?`
      params.push(couple.total_budget);
    }
    // if (couple.services) {
    //   query += ` AND JSON_CONTAINS(v.services, ?)`
    //   params.push(JSON.stringify(couple.services));
    // }


    if (services) {
      // query += " AND JSON_CONTAINS(v.services, ?)";
      // params.push(JSON.stringify(services));
      const serviceConditions = services.map(() => `JSON_CONTAINS(v.services, ?)`).join(' OR ');
      query += ` AND (${serviceConditions})`;
      services.forEach(service => {
        params.push(JSON.stringify(service)); // each needs to be a JSON-quoted string
      });
    } else {
      if (couple.services && couple.services.length > 0) {
        const serviceConditions = couple.services.map(() => `JSON_CONTAINS(v.services, ?)`).join(' OR ');
        query += ` AND (${serviceConditions})`;
        couple.services.forEach(service => {
          params.push(JSON.stringify(service)); // each needs to be a JSON-quoted string
        });
      }
    }

    if (couple.start_date && couple.end_date) {
      query += ` AND va.start_date <= ? AND va.end_date >= ?`;
      params.push(format(new Date(couple.end_date), 'yyyy-MM-dd'), format(new Date(couple.start_date), 'yyyy-MM-dd'));
    } else {
      if (couple.start_date) {
        query += ` AND va.start_date >= ?`
        params.push(couple.start_date);
      }

      if (couple.end_date) {
        query += ` AND va.end_date <= ?`
        params.push(couple.end_date);
      }
    }


    query += ` GROUP BY v.vendor_id`;
    const vendors = await db.query(query, params);


    res.json({
      success: true,
      vendors,
      coupleBudget: couple.total_budget,
    });
  } catch (error) {
    logger.error('List vendors error:', error);
    res.status(500).json({ error: 'Server error while listing vendors' });
  }
};

exports.listVendor_new = async (req, res) => {
  const userId = req.user.user_id;
  const { category, location, minRating, search, services } = req.query;

  try {
    const [couple] = await db.query("SELECT start_date, end_date FROM couples WHERE user_id = ?", [userId]);
    if (!couple) {
      return res.status(404).json({ error: "Invalid User" });
    }

    const baseQuery = `
      SELECT v.vendor_id vendorId, v.business_name as businessName, v.location, v.rating, v.services, v.base_price basePrice, v.description, vc.category_name as categoryName 
      FROM vendors v
      JOIN categories vc ON v.category_id = vc.category_id
      JOIN vendor_availability va ON v.vendor_id = va.vendor_id
      WHERE 1=1
    `;

    const buildQuery = (startDate, endDate) => {
      let query = baseQuery;
      const params = [];

      if (category) {
        query += ' AND v.category_id = ?';
        params.push(category);
      }

      if (location) {
        query += ' AND v.location LIKE ?';
        params.push(`%${location}%`);
      }

      if (minRating) {
        query += ' AND v.rating >= ?';
        params.push(minRating);
      }

      if (search) {
        query += ' AND (v.business_name LIKE ? OR v.services LIKE ?)';
        params.push(`%${search}%`);
        params.push(`%${search}%`);
      }

      if (services) {
        query += " AND JSON_CONTAINS(v.services, ?)";
        params.push(JSON.stringify(services));
      }

      if (startDate) {
        query += ` AND va.start_date >= ?`;
        params.push(startDate);
      }

      if (endDate) {
        query += ` AND va.end_date <= ?`;
        params.push(endDate);
      }

      return { query, params };
    };

    // Step 1: Try for original range
    let { query, params } = buildQuery(couple.start_date, couple.end_date);
    let vendors = await db.query(query, params);
    let fallbackUsed = false;
    // Step 2: If no vendors, try with start_date + 30 days range
    if (!vendors.length) {
      fallbackUsed = true;
      const originalStart = new Date(couple.start_date);
      const fallbackStart = new Date(originalStart);
      const fallbackEnd = new Date(originalStart);
      fallbackEnd.setDate(fallbackEnd.getDate() + 30);

      ({ query, params } = buildQuery(fallbackStart.toISOString().slice(0, 10), fallbackEnd.toISOString().slice(0, 10)));
      vendors = await db.query(query, params);
    }

    res.json({
      success: true,
      vendors,
      fallbackUsed
    });

  } catch (error) {
    logger.error('List vendors error:', error);
    res.status(500).json({ error: 'Server error while listing vendors' });
  }
};

// Get vendor availability
exports.getAvailability = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // First, get vendor_id from user_id
    const [vendor] = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);
    if (!vendor) {
      return res.status(404).json({
        status: 'fail',
        error: 'Vendor profile not found for this user'
      });
    }

    const vendorId = vendor.vendor_id;

    const availability = await db.query(`
          SELECT * FROM vendor_availability 
          WHERE vendor_id = ? 
          ORDER BY date ASC, start_time ASC
      `, [vendorId]);

    res.status(200).json({
      status: 'success',
      results: availability.length,
      data: availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch availability'
    });
  }
};

// Set vendor availability
exports.setAvailability = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        error: errors.array()
      });
    }

    const userId = req.user.user_id;
    const { date, start_time, end_time, is_available = 1 } = req.body;

    if (!date || !start_time || !end_time) {
      return res.status(400).json({
        status: 'fail',
        error: 'Date, start time, and end time are required'
      });
    }

    // Validate time format
    if (start_time >= end_time) {
      return res.status(400).json({
        status: 'fail',
        error: 'Start time must be before end time'
      });
    }

    // Get vendor_id from user_id
    const vendor = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);

    if (vendor.length === 0) {
      return res.status(404).json({
        status: 'fail',
        error: 'Vendor profile not found for this user'
      });
    }

    const vendorId = vendor[0].vendor_id;

    // Check for overlapping time slots
    const overlaps = await db.query(`
          SELECT * FROM vendor_availability 
          WHERE vendor_id = ? AND date = ? AND 
          ((start_time <= ? AND end_time > ?) OR 
           (start_time < ? AND end_time >= ?) OR 
           (start_time >= ? AND end_time <= ?))
      `, [vendorId, date, start_time, start_time, end_time, end_time, start_time, end_time]);

    if (overlaps.length > 0) {
      return res.status(400).json({
        status: 'fail',
        error: 'This time slot overlaps with an existing availability'
      });
    }

    // Insert new availability
    const result = await db.query(`
          INSERT INTO vendor_availability (vendor_id, date, start_time, end_time, is_available)
          VALUES (?, ?, ?, ?, ?)
      `, [vendorId, date, start_time, end_time, is_available]);

    // Get the created availability
    const [availability] = await db.query(
      'SELECT * FROM vendor_availability WHERE availability_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      status: 'success',
      message: 'Availability set successfully',
      data: availability
    });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to set availability'
    });
  }
};

// Delete vendor availability
exports.deleteAvailability = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const availabilityId = req.params.id;

    // Get vendor_id from user_id
    const vendor = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);

    if (vendor.length === 0) {
      return res.status(404).json({
        status: 'fail',
        error: 'Vendor profile not found for this user'
      });
    }

    const vendorId = vendor[0].vendor_id;

    // Check if availability exists and belongs to this vendor
    const availabilityCheck = await db.query(
      'SELECT * FROM vendor_availability WHERE availability_id = ? AND vendor_id = ?',
      [availabilityId, vendorId]
    );

    if (availabilityCheck.length === 0) {
      return res.status(404).json({
        status: 'fail',
        error: 'Availability not found or not owned by this vendor'
      });
    }

    // Check if there are any bookings for this availability
    const bookings = await db.query(`
          SELECT * FROM bookings 
          WHERE vendor_id = ? AND booking_date = ? AND 
          ((start_time >= ? AND start_time < ?) OR 
           (end_time > ? AND end_time <= ?) OR 
           (start_time <= ? AND end_time >= ?))
      `, [
      vendorId,
      availabilityCheck[0].date,
      availabilityCheck[0].start_time,
      availabilityCheck[0].end_time,
      availabilityCheck[0].start_time,
      availabilityCheck[0].end_time,
      availabilityCheck[0].start_time,
      availabilityCheck[0].end_time
    ]);

    if (bookings.length > 0) {
      return res.status(400).json({
        status: 'fail',
        error: 'Cannot delete availability with existing bookings'
      });
    }

    // Delete the availability
    await db.query('DELETE FROM vendor_availability WHERE availability_id = ?', [availabilityId]);

    res.status(200).json({
      status: 'success',
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to delete availability'
    });
  }
};

exports.getVendorDetails = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Get vendor basic information
    const vendor = await db.query(`
          SELECT v.vendor_id vendorId, v.category_id categoryId, v.business_name businessName, v.description, v.website, v.location, ROUND(AVG(r.rating), 1) AS rating, v.services, v.base_price basePrice,
                 vc.category_id categoryId, vc.category_name categoryName, u.phone_number phoneNumber, u.email email
          FROM vendors v
          JOIN users u ON v.user_id = u.user_id
          JOIN categories vc ON v.category_id = vc.category_id
          LEFT JOIN reviews r ON v.vendor_id = r.vendor_id
          WHERE v.vendor_id = ? GROUP BY v.vendor_id
      `, [vendorId]);

    if (vendor.length === 0) {
      return res.status(404).json({
        status: 'fail',
        error: 'Vendor not found'
      });
    }

    // Get vendor availability for the next 30 days
    const availability = await db.query(`
          SELECT availability_id availabilityId, start_date startDate, end_date endate, is_available isAvailable FROM vendor_availability 
          WHERE vendor_id = ?
          ORDER BY updated_at DESC
      `, [vendorId]);
      // AND start_date >= CURDATE() AND end_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)

    // Combine all information
    const vendorData = {
      ...vendor[0],
      availability
    };

    res.status(200).json({
      status: 'success',
      data: vendorData
    });
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to fetch vendor details'
    });
  }
};

// Get vendor reviews
exports.getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // First check if vendor exists
    const vendorCheck = await db.query('SELECT vendor_id FROM vendors WHERE vendor_id = ?', [vendorId]);

    if (vendorCheck.length === 0) {
      return res.status(404).json({
        status: 'fail',
        error: 'Vendor not found'
      });
    }

    // This assumes you have a reviews table. If not, you'll need to create one or modify this accordingly.
    const reviews = await db.query(`
          SELECT r.review_id, r.booking_id, r.rating, r.comment, r.created_at,
                 c.partner_name
          FROM reviews r
          JOIN bookings b ON r.booking_id = b.booking_id
          JOIN couples c ON b.couple_id = c.couple_id
          WHERE b.vendor_id = ?
          ORDER BY r.created_at DESC
      `, [vendorId]);

    // Calculate average rating
    let avgRating = 0;
    if (reviews.length > 0) {
      avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      avgRating,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching vendor reviews:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to fetch vendor reviews'
    });
  }
};
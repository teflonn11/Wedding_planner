const { format } = require('date-fns');
const db = require('../config/database');
const logger = require('../utils/logger');

exports.createBooking = async (req, res) => {
  const userId = req.user.user_id;
  const { vendorId = [], plannerId = [], bookingDate, totalPrice, notes = '' } = req.body;
  try {
    if (vendorId.length === 0 && plannerId.length === 0) {
      return res.status(400).json({ error: 'Bad request' });
    }
    // Get couple ID
    const couple = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);

    if (couple.length === 0) {
      return res.status(404).json({ error: 'Couple profile not found' });
    }

    // Create booking
    const result = await db.query(
      'INSERT INTO bookings (couple_id, vendor_id, planner_id, booking_date, total_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [couple[0].couple_id, vendorId.join(), plannerId.join(), bookingDate, totalPrice, notes]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error while creating booking' });
  }
};

exports.getBookings = async (req, res) => {
  const userId = req.user.user_id;
  const { status } = req.query;

  try {
    let query, params;
    // Check if user is a couple or vendor
    const coupleCheck = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);
    const vendorCheck = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);
    const plannerCheck = await db.query('SELECT planner_id FROM planners WHERE user_id = ?', [userId]);
    if (coupleCheck.length > 0) {
      query = `
      SELECT c.total_budget totalCoupleBudget, c.start_date as coupleStartDate, c.end_date as coupleEndDate, c.location as coupleLocation, c.guest_count as coupleGuestCount, cu.first_name as coupleFirstName, cu.last_name as coupleLastName,cu.email as coupleEmail, cu.phone_number as couplePhoneNumber, b.booking_id bookingId, b.couple_id coupleId, b.vendor_id vendorId, b.planner_id plannerId, b.status, b.total_price totalPrice, b.notes, b.booking_date bookingDate, pay.amount paymentAmount, pay.payment_date paymentDate, pay.payment_method paymentMethod, pay.transaction_id transactionId, pay.status paymentStatus, pay.card_details cardDetails
      FROM bookings b
      LEFT JOIN couples c ON b.couple_id = c.couple_id
      JOIN users cu ON c.user_id = cu.user_id
      LEFT JOIN payments pay ON b.booking_id = pay.booking_id
      WHERE b.couple_id = ? ORDER BY b.booking_id DESC
    `;
      params = [coupleCheck[0].couple_id];
    } else if (vendorCheck.length > 0) {
      query = `
        SELECT c.total_budget totalCoupleBudget, c.start_date as coupleStartDate, c.end_date as coupleEndDate, c.location as coupleLocation, c.guest_count as coupleGuestCount, cu.first_name as coupleFirstName, cu.last_name as coupleLastName,cu.email as coupleEmail, cu.phone_number as couplePhoneNumber, b.booking_id bookingId, b.couple_id coupleId, b.vendor_id vendorId, b.planner_id plannerId, b.status, b.total_price totalPrice, b.notes, b.booking_date bookingDate, pay.amount paymentAmount, pay.payment_date paymentDate, pay.payment_method paymentMethod, pay.transaction_id transactionId, pay.status paymentStatus, pay.card_details cardDetails,
        v.vendor_id vendorId, v.business_name businessName, v.services, v.location vendorLocation, v.description vendorDescription, v.website vendorWebsite, v.rating vendorRating, v.base_price vendorBasePrice, v.duration_hours vendorDurationHours, cat.category_name categoryName, cat.description categoryDescription, va.start_date startDate, va.end_date endDate, u.email, u.phone_number phoneNumber
      FROM bookings b
       JOIN couples c ON b.couple_id = c.couple_id
       JOIN users cu ON c.user_id = cu.user_id
       JOIN payments pay ON b.booking_id = pay.booking_id
        LEFT JOIN vendors v ON FIND_IN_SET(v.vendor_id, b.vendor_id)
        LEFT JOIN users u ON v.user_id = u.user_id
        LEFT JOIN vendor_availability va ON b.vendor_id = va.vendor_id
        LEFT JOIN categories cat ON v.category_id = cat.category_id
      WHERE FIND_IN_SET(?, b.vendor_id) ORDER BY b.booking_id DESC
      `;
      params = [vendorCheck[0].vendor_id];
    } else if (plannerCheck.length > 0) {
      query = `
        SELECT c.total_budget totalCoupleBudget, c.start_date as coupleStartDate, c.end_date as coupleEndDate, c.location as coupleLocation, c.guest_count as coupleGuestCount, cu.first_name as coupleFirstName, cu.last_name as coupleLastName,cu.email as coupleEmail, cu.phone_number as couplePhoneNumber, b.booking_id bookingId, b.couple_id coupleId, b.vendor_id vendorId, b.planner_id plannerId, b.status, b.total_price totalPrice, b.notes, b.booking_date bookingDate, pay.amount paymentAmount, pay.payment_date paymentDate, pay.payment_method paymentMethod, pay.transaction_id transactionId, pay.status paymentStatus, pay.card_details cardDetails,
        p.planner_id plannerId, p.business_name businessName, p.services, p.location plannerLocation, p.description plannerDescription, p.website plannerWebsite, p.rating plannerRating, p.base_price plannerBasePrice, p.duration_hours plannersDurationHours, cat.category_name categoryName, cat.description categoryDescription, pa.start_date startDate, pa.end_date endDate, u.email, u.phone_number phoneNumber
      FROM bookings b
       JOIN couples c ON b.couple_id = c.couple_id
       JOIN users cu ON c.user_id = cu.user_id
       JOIN payments pay ON b.booking_id = pay.booking_id
        LEFT JOIN planners p ON FIND_IN_SET(p.planner_id, b.planner_id)
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN planner_availability pa ON b.planner_id = pa.planner_id
        LEFT JOIN categories cat ON p.category_id = cat.category_id
      WHERE FIND_IN_SET(?, b.planner_id) ORDER BY b.booking_id DESC
      `;
      params = [plannerCheck[0].planner_id];

    } else {
      return res.status(403).json({ error: 'User not authorized' });
    }

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    let bookings = await db.query(query, params);
    if (bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found' });
    }
    // bookings = bookings.map(async (booking) => {
    let tempArray = [];
    if (coupleCheck.length > 0) {
      for (let booking of bookings) {
        let newObj = { ...booking };
        if (booking?.vendorId) {
          const vendorIds = booking.vendorId.split(',');
          const placeholders = vendorIds.map(() => '?').join(', ');
          const vendor_query = `
            SELECT 
              v.vendor_id AS vendorId,
              v.business_name AS businessName,
              v.services,
              v.location,
              v.description,
              v.website,
              v.rating,
              v.base_price AS basePrice,
              v.duration_hours AS durationHours,
              cat.category_name AS categoryName,
              cat.description AS categoryDescription,
              va.start_date AS startDate,
              va.end_date AS endDate,
              u.email,
              u.phone_number AS phoneNumber,
              (
                SELECT ROUND(AVG(r.rating), 1)
                FROM reviews r
                WHERE r.vendor_id = v.vendor_id
              ) AS rating,
              (
                SELECT 
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'review_id', r.review_id,
                      'first_name', r.first_name,
                      'last_name', r.last_name,
                      'email', r.email,
                      'comment', r.comment,
                      'rating', r.rating,
                      'created_at', r.created_at
                    )
                  )
                FROM reviews r
                WHERE r.vendor_id = v.vendor_id AND r.user_id = ${userId}
              ) AS self_reviews
            FROM vendors v
            JOIN users u ON v.user_id = u.user_id
            JOIN categories cat ON v.category_id = cat.category_id
            JOIN vendor_availability va ON v.vendor_id = va.vendor_id
            WHERE v.vendor_id IN (${placeholders})
          `;

          const vendors = await db.query(
            vendor_query,
            vendorIds
          );
          newObj['vendors'] = vendors.map(vendor => ({
            ...vendor,
            startDate: vendor.startDate ? format(new Date(vendor.startDate), 'yyyy-MM-dd') : '',
            endDate: vendor.endDate ? format(new Date(vendor.endDate), 'yyyy-MM-dd') : ''
          }));
        }
        if (booking?.plannerId) {
          const plannerIds = booking.plannerId.split(',');
      const placeholders = plannerIds.map(() => '?').join(', ');
          
          const planner_query = `
            SELECT 
              p.planner_id AS plannerId,
              p.business_name AS businessName,
              p.services,
              p.location,
              p.description,
              p.website,
              p.rating,
              p.base_price AS basePrice,
              p.duration_hours AS durationHours,
              cat.category_name AS categoryName,
              cat.description AS categoryDescription,
              pa.start_date AS startDate,
              pa.end_date AS endDate,
              u.email,
              u.phone_number AS phoneNumber,
              (
                SELECT ROUND(AVG(r.rating), 1)
                FROM reviews r
                WHERE r.planner_id = p.planner_id
              ) AS rating,
              (
                SELECT 
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'review_id', r.review_id,
                      'first_name', r.first_name,
                      'last_name', r.last_name,
                      'email', r.email,
                      'comment', r.comment,
                      'rating', r.rating,
                      'created_at', r.created_at
                    )
                  )
                FROM reviews r
                WHERE r.planner_id = p.planner_id AND r.user_id = ${userId}
              ) AS self_reviews
            FROM planners p
            JOIN users u ON p.user_id = u.user_id
            JOIN categories cat ON p.category_id = cat.category_id
            JOIN planner_availability pa ON p.planner_id = pa.planner_id
            WHERE p.planner_id IN (${placeholders})
          `;
          const planners = await db.query(
            planner_query,
            plannerIds
          );
          newObj['planners'] = planners.map(planner => ({
            ...planner,
            startDate: planner.startDate ? format(new Date(planner.startDate), 'yyyy-MM-dd') : '',
            endDate: planner.endDate ? format(new Date(planner.endDate), 'yyyy-MM-dd') : ''
          }));
        }
        tempArray.push(newObj);
      }
    } else {
      tempArray = bookings
    }
    res.json({
      success: true,
      bookings: tempArray
    });
  } catch (error) {
    logger.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error while fetching bookings' });
  }
};

exports.createReview = async (req, res) => {
  const userId = req.user.user_id;
  const bookingId = req.params.id;
  const { rating, comment } = req.body;

  try {
    // Verify booking belongs to the couple
    const bookings = await db.query(
      'SELECT couple_id FROM bookings WHERE booking_id = ? AND couple_id = (SELECT couple_id FROM couples WHERE user_id = ?)',
      [bookingId, userId]
    );

    if (bookings.length === 0) {
      return res.status(403).json({ error: 'Not authorized to review this booking' });
    }

    // Create review
    await db.query(
      'INSERT INTO reviews (booking_id, rating, comment) VALUES (?, ?, ?)',
      [bookingId, rating, comment]
    );

    // Update vendor rating
    const vendorRating = await db.query(
      'SELECT AVG(r.rating) as avg_rating FROM reviews r JOIN bookings b ON r.booking_id = b.booking_id WHERE b.vendor_id = (SELECT vendor_id FROM bookings WHERE booking_id = ?)',
      [bookingId]
    );

    await db.query(
      'UPDATE vendors SET rating = ? WHERE vendor_id = (SELECT vendor_id FROM bookings WHERE booking_id = ?)',
      [vendorRating[0].avg_rating, bookingId]
    );

    res.status(201).json({
      success: true,
      message: 'Review created successfully'
    });
  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({ error: 'Server error while creating review' });
  }
};

/**
 * Get detailed information about a specific booking
 */
exports.getBookingDetails = async (req, res) => {
  const userId = req.user.user_id;
  const bookingId = req.params.id;

  try {
    // First determine if user is a couple or vendor
    const couple = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);
    const vendor = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);

    let accessCondition;
    let queryParams = [bookingId];

    if (couple.length > 0) {
      // User is a couple, can only access their own bookings
      accessCondition = 'b.couple_id = ?';
      queryParams.push(couple[0].couple_id);
    } else if (vendor.length > 0) {
      // User is a vendor, can only access bookings made with them
      accessCondition = 'b.vendor_id = ?';
      queryParams.push(vendor[0].vendor_id);
    } else {
      return res.status(403).json({ error: 'Unauthorized access to booking' });
    }
    // Get complete booking details with related information

    const [booking] = await db.query(
      `SELECT c.total_budget totalCoupleBudget, b.booking_id bookingId, b.couple_id coupleId, b.vendor_id vendorId, b.planner_id plannerId, b.status, b.total_price totalPrice, b.notes, b.booking_date bookingDate, pay.amount paymentAmount, pay.payment_date paymentDate, pay.payment_method paymentMethod, pay.transaction_id transactionId, pay.status paymentStatus, pay.card_details cardDetails
      FROM bookings b
      LEFT JOIN couples c ON b.couple_id = c.couple_id
      LEFT JOIN payments pay ON b.booking_id = pay.booking_id
       WHERE b.booking_id = ? AND ${accessCondition}`,
      queryParams
    );
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or access denied' });
    }

    if (booking?.vendorId) {
      const vendorIds = booking.vendorId.split(',');
      const placeholders = vendorIds.map(() => '?').join(', ');
      const vendor_query = `SELECT v.vendor_id vendorId, v.business_name businessName, v.services, v.location, v.description, v.website, v.rating, v.base_price basePrice, v.duration_hours durationHours, cat.category_name categoryName, u.email, u.phone_number phoneNumber 
          FROM vendors v
          JOIN users u ON v.user_id = u.user_id
          JOIN categories cat ON v.category_id = cat.category_id
          WHERE v.vendor_id IN (${placeholders})`;
      booking['vendors'] = await db.query(
        vendor_query,
        vendorIds
      );
    }
    if (booking?.plannerId) {
      const plannerIds = booking.plannerId.split(',');
      const placeholders = plannerIds.map(() => '?').join(', ');
      const planner_query = `SELECT v.planner_id plannerId, v.business_name businessName, v.services, v.location, v.description, v.website, v.rating, v.base_price basePrice, v.duration_hours durationHours, cat.category_name categoryName, u.email, u.phone_number phoneNumber
          FROM planners v
          JOIN users u ON v.user_id = u.user_id
          JOIN categories cat ON v.category_id = cat.category_id
          WHERE v.planner_id IN (${placeholders})`;
      booking['planners'] = await db.query(
        planner_query,
        plannerIds
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error('Get booking details error:', error);
    res.status(500).json({ error: 'Server error while fetching booking details' });
  }
};

/**
 * Update booking details - limited by role and booking status
 */
exports.updateBooking = async (req, res) => {
  const userId = req.user.user_id;
  const bookingId = req.params.id;
  const { notes, bookingDate } = req.body;

  try {
    // First verify the booking exists
    const booking = await db.query('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);

    if (booking.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Determine if user is a couple or vendor and check access rights
    const couple = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);
    const vendor = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);

    let canModifyDetails = false;
    let canModifyNotes = false;

    if (couple.length > 0 && booking[0].couple_id === couple[0].couple_id) {
      // Couples can modify notes anytime, but can only change booking details if status is pending
      canModifyNotes = true;
      canModifyDetails = booking[0].status === 'pending';
    } else if (vendor.length > 0 && booking[0].vendor_id === vendor[0].vendor_id) {
      // Vendors can modify notes anytime, but can only change booking details if status is pending or confirmed
      canModifyNotes = true;
      canModifyDetails = booking[0].status === 'pending' || booking[0].status === 'confirmed';
    } else {
      return res.status(403).json({ error: 'Unauthorized access to booking' });
    }

    // Handle updates based on permissions
    const updateFields = [];
    const queryParams = [];

    // Notes can be updated regardless of status
    if (notes !== undefined && canModifyNotes) {
      updateFields.push('notes = ?');
      queryParams.push(notes);
    }

    // Booking details can only be updated if status allows it
    if (canModifyDetails) {
      if (bookingDate !== undefined) {
        updateFields.push('booking_date = ?');
        queryParams.push(bookingDate);
      }


      // If date/time changes, verify vendor availability
      if (bookingDate !== undefined) {
        const checkDate = bookingDate || booking[0].booking_date;

        // Check if vendor is available at this time
        const availability = await db.query(
          `SELECT * FROM vendor_availability 
           WHERE vendor_id = ? AND date = ? AND is_available = 1`,
          [booking[0].vendor_id, checkDate]
        );

        if (availability.length === 0) {
          return res.status(400).json({ error: 'Vendor is not available at the selected time' });
        }

        // Check for conflicting bookings
        const conflicts = await db.query(
          `SELECT booking_id FROM bookings 
           WHERE vendor_id = ? AND booking_date = ? AND booking_id != ? AND status IN ('pending', 'confirmed') AND
           ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?) OR (start_time >= ? AND end_time <= ?))`,
          [booking[0].vendor_id, checkDate, bookingId, checkStart, checkStart, checkEnd, checkEnd, checkStart, checkEnd]
        );

        if (conflicts.length > 0) {
          return res.status(400).json({ error: 'This time slot conflicts with another booking' });
        }
      }
    } else if (bookingDate !== undefined || startTime !== undefined || endTime !== undefined) {
      return res.status(400).json({
        error: 'Cannot modify booking details with current status',
        status: booking[0].status
      });
    }

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Complete the query parameters
    queryParams.push(bookingId);

    // Update the booking
    const query = `UPDATE bookings SET ${updateFields.join(', ')} WHERE booking_id = ?`;
    console.log(query, queryParams, updateFields, canModifyNotes);
    await db.query(query, queryParams);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    logger.error('Update booking error:', error);
    res.status(500).json({ error: 'Server error while updating booking' });
  }
};

/**
 * Cancel a booking (available to couples only)
 */
exports.cancelBooking = async (req, res) => {
  const userId = req.user.user_id;
  const bookingId = req.params.id;

  try {
    // Verify the booking exists
    const [booking] = await db.query('SELECT * FROM bookings WHERE booking_id = ?', [bookingId]);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Get role from users
    const [user] = await db.query('SELECT role_id FROM users WHERE user_id = ?', [userId]);
    let isAuthorized = false;
    const roleId = user.role_id;

    // 3. Check if user is couple
    if (roleId === 1) {
      const [couple] = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);
      isAuthorized = couple && booking.couple_id == couple.couple_id;
    }

    // 4. Check if user is vendor
    if (roleId === 2 && booking.vendor_id) { // assuming 3 = vendor
      const [vendor] = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);
      isAuthorized = vendor && booking.vendor_id && booking.vendor_id.length > 0 ? booking.vendor_id.split(',').indexOf(vendor.vendor_id.toString()) > -1 : false;
    }

    // 5. Check if user is planner
    if (roleId === 3 && booking.planner_id) { // assuming 4 = planner
      const [planner] = await db.query('SELECT planner_id FROM planners WHERE user_id = ?', [userId]);
      // isAuthorized = planner && booking.planner_id === planner.planner_id;
      isAuthorized = planner && booking.planner_id && booking.planner_id.length > 0 ? booking.planner_id.split(',').indexOf(planner.planner_id.toString()) > -1 : false;
    }
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized access to booking' });
    }

    // // Check if user is the couple who made this booking
    // const couple = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);

    // if (couple.length === 0 || booking[0].couple_id !== couple[0].couple_id) {
    //   return res.status(403).json({ error: 'Unauthorized access to booking' });
    // }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }

    // Check cancellation policy (example: within 48 hours of booking date)
    const bookingDate = new Date(booking.booking_date);
    const currentDate = new Date();
    const timeDiff = bookingDate.getTime() - currentDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    let cancellationFee = 0;
    /*
    // Apply cancellation fee based on notice period
    if (hoursDiff < 48) {
      // Less than 48 hours notice: 50% fee
      cancellationFee = booking.total_price * 0.5;
    } else if (hoursDiff < 168) {
      // Less than 7 days notice: 20% fee
      cancellationFee = booking.total_price * 0.2;
    }
      */

    // Begin transaction
    const connection = await db.getConnection();

    try {
      // Update booking status
      await connection.beginTransaction(); // Start transaction
      await connection.execute(
        'UPDATE bookings SET status = ? WHERE booking_id = ?',
        ['cancelled', bookingId]
      );

      // Check if payment exists
      const payment = await connection.execute(
        'SELECT * FROM payments WHERE booking_id = ?',
        [bookingId]
      );

      if (payment.length > 0) {
        const updateRefundQuery = `UPDATE payments SET status = 'refunded' WHERE booking_id = ?`;
        await connection.execute(updateRefundQuery, [bookingId]);
      }

      // Commit transaction
      await connection.commit(); // Commit transaction

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        cancellationFee: cancellationFee > 0 ? cancellationFee : null
      });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback(); // Rollback on error
      throw error;
    }
    finally {
      connection.release(); // Release connection back to pool
    }
  } catch (error) {
    logger.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Server error while cancelling booking' });
  }
};

exports.completeBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.user_id;
  const [booking] = await db.query("SELECT * FROM bookings WHERE booking_id = ?", [bookingId]);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  const [user] = await db.query('SELECT role_id FROM users WHERE user_id = ?', [userId]);
  let isAuthorized = false;
  const roleId = user.role_id;

  if ([1,2,3].includes(roleId)) {
    if(roleId === 1) {
      const [couple] = await db.query('SELECT couple_id FROM couples WHERE user_id = ?', [userId]);
      isAuthorized = couple && booking.couple_id == couple.couple_id;
    } else if (roleId === 2) {
      const [vendor] = await db.query('SELECT vendor_id FROM vendors WHERE user_id = ?', [userId]);
      isAuthorized = vendor && booking.vendor_id && booking.vendor_id.length > 0 ? booking.vendor_id.split(',').indexOf(vendor.vendor_id.toString()) > -1 : false;
    } else if (roleId === 3) {
      const [planner] = await db.query('SELECT planner_id FROM planners WHERE user_id = ?', [userId]);
      isAuthorized = planner && booking.planner_id && booking.planner_id.length > 0 ? booking.planner_id.split(',').indexOf(planner.planner_id.toString()) > -1 : false;
    }
  }
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Unauthorized access to booking' });
  }
  
  await db.query("UPDATE bookings SET status = 'completed' WHERE booking_id = ?", [bookingId]);
  res.status(200).json({ success: true, message: 'Booking status updated successfully' });
}

const processRefund = async (bookingId) => {
  const connection = await db.getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Get payment details
    const payment = await db.query('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);

    if (!(payment.length === 0 || payment[0].status === 'refunded')) {
      // Update payment status to refunded
      await connection.execute('UPDATE payments SET status = ? WHERE payment_id = ?', ['refunded', req.params.id]);

      // Update the booking status
      await connection.execute('UPDATE bookings SET status = ? WHERE booking_id = ?', ['cancelled', payment[0].booking_id]);
      // Commit the transaction
      await connection.commit();
    }

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully'
    });
  } catch (error) {
    // Rollback in case of error
    await connection.rollback();
  } finally {
    connection.release(); // Release connection back to pool
  }
};
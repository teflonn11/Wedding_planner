const { format } = require('date-fns');
const db = require('../config/database');
const logger = require('../utils/logger');

const setVendorAvailability = async (startDate, endDate, vendorId, isAvailable = 1) => {
    const resData = {
        success: true,
        data: [],
        msg: ""
    }
    try {
        // Check for overlapping time slots
        const overlaps = await db.query(`
    SELECT * FROM vendor_availability 
    WHERE vendor_id = ? AND 
    ((start_date <= ? AND end_date > ?) OR 
     (start_date < ? AND end_date >= ?) OR 
     (start_date >= ? AND end_date <= ?))
`, [vendorId, startDate, startDate, endDate, endDate, startDate, endDate]);

        if (overlaps.length > 0) {
            resData.success = false;
            resData.msg = 'This time slot overlaps with an existing availability';
            return resData;
            // return res.status(400).json({
            //     status: 'fail',
            //     message: 'This time slot overlaps with an existing availability'
            // });
        }

        // Insert new availability
        await db.query(`
    INSERT INTO vendor_availability (vendor_id, start_date, end_date, is_available)
    VALUES (?, ?, ?, ?)
`, [vendorId, format(new Date(startDate), 'yyyy-MM-dd'), format(new Date(endDate), 'yyyy-MM-dd'), isAvailable]);

        return resData;
    } catch (ex) {
        logger.error('Exception while checking updating vendor_availability', ex);
        resData.success = false;
        resData.msg = 'Updating failed'
    }

}

module.exports = {
    setVendorAvailability
}
const { format } = require('date-fns');
const db = require('../config/database');
const logger = require('../utils/logger');
const { setPlannerAvailability } = require('../services/plannerService');
const { error } = require('winston');

// Get Planner Profile
exports.getPlannerProfile = async (req, res) => {
    const userId = req.user.user_id;

    try {
        let planners = await db.query(
            `SELECT u.first_name firstName, u.last_name lastName, u.email, u.phone_number phoneNumber, u.gender, pa.start_date startDate, pa.end_date endDate, p.planner_id plannerId, p.user_id userId, p.business_name businessName, p.category_id categoryId, p.description, p.website, p.location, p.rating, p.is_verified isVerified, p.base_price basePrice, p.duration_hours durationHours, p.services  FROM users u
          LEFT JOIN planners p ON u.user_id = p.user_id
          LEFT JOIN planner_availability pa ON p.planner_id = pa.planner_id
         WHERE u.user_id = ?`,
            [userId]
        );

        if (planners.length === 0) {
            return res.status(404).json({ error: 'Planner profile not found' });
        }
        planners = planners.map(planner => ({
            ...planner,
            startDate: planner.startDate ? format(new Date(planner.startDate), 'yyyy-MM-dd') : '',
            endDate: planner.endDate ? format(new Date(planner.endDate), 'yyyy-MM-dd') : ''
        }));

        res.json({
            success: true,
            profile: planners[0]
        });
    } catch (error) {
        logger.error('Get planner profile error:', error);
        res.status(500).json({ error: 'Server error while fetching planner profile' });
    }
};

// Create Planner Profile
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
        const existingPlanner = await db.query('SELECT * FROM planners WHERE user_id = ?', [userId]);

        if (existingPlanner.length > 0) {
            return res.status(400).json({ error: 'Planner profile already exists' });
        }
        // Create vendor profile
        const result = await db.query(
            'INSERT INTO planners (user_id, business_name, category_id, description, website, location, services, base_price, duration_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, businessName, categoryId, description, website, location, services, basePrice, durationHours]
        );
        await setPlannerAvailability(startDate, endDate, result.insertId);

        res.status(201).json({
            success: true,
            message: 'Planner profile created successfully',
            vendorId: result.insertId
        });
    } catch (error) {
        logger.error('Create planner profile error:', error);
        res.status(500).json({ error: 'Server error while creating planner profile' });
    }
};

// Update Planner Profile
exports.updatePlannerProfile = async (req, res) => {
    const userId = req.user.user_id;
    const { firstName, lastName, phoneNumber, gender, businessName, categoryId, description, website, location, services, basePrice, startDate, endDate, durationHours } = req.body;

    try {
        const [planner] = await db.query("SELECT planner_id FROM planners WHERE user_id = ?", [userId]);
        if (!planner) {
            return res.status(404).json({ error: "Planner profile not found" });
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
        const query = `UPDATE planners SET ${updateFields.join(", ")} WHERE user_id = ?`;

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

        values.push(planner.planner_id);
        if (values.length > 1) {
            const availability_query = `UPDATE planner_availability SET ${updateFields.join(", ")} WHERE planner_id = ?`;
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
            message: "Planner profile updated successfully"
        });
    } catch (error) {
        logger.error("Update planner profile error:", error);
        res.status(500).json({ error: "Server error while updating planner profile" });
    }
};

exports.listPlanners = async (req, res) => {
    const userId = req.user.user_id;
    const { category, location, minRating, search, services } = req.query;

    try {
        const [couple] = await db.query("SELECT start_date, end_date, total_budget, services FROM couples WHERE user_id = ?", [userId]);
        if (!couple) {
            return res.status(404).json({ error: "Invalid User" });
        }
        let query = `
          SELECT p.planner_id plannerId, p.business_name as businessName, p.location, ROUND(AVG(r.rating), 1) AS rating, p.services, p.base_price basePrice, p.description, vc.category_name as categoryName 
          FROM planners p
          JOIN categories vc ON p.category_id = vc.category_id
          JOIN planner_availability pa ON p.planner_id = pa.planner_id
          LEFT JOIN reviews r ON p.planner_id = r.planner_id
          WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += ' AND p.category_id = ?';
            params.push(category);
        }

        if (location) {
            query += ' AND p.location LIKE ?';
            params.push(`%${location}%`);
        }

        if (minRating) {
            query += ' AND p.rating >= ?';
            params.push(minRating);
        }
        if (search) {
            query += ' AND (p.business_name LIKE ? OR p.services LIKE ?)';
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }

        if (couple.total_budget) {
            query += ` AND p.base_price <= ?`
            params.push(couple.total_budget);
        }
        // if (couple.services) {
        //     query += ` AND JSON_CONTAINS(p.services, ?)`
        //     params.push(JSON.stringify(couple.services));
        // }

        // if (services) {
        //     // if (!Array.isArray(serviceName)) {
        //     query += " AND JSON_CONTAINS(p.services, ?)";
        //     params.push(JSON.stringify(services));
        //     // } else {
        //     //     const tempServiceName = serviceName.splice('@');
        //     //     const conditions = tempServiceName
        //     //         .map(() => 'JSON_CONTAINS(p.services, ?)')
        //     //         .join(' OR ');
        //     //     query += ` AND (${conditions})`;
        //     //     params.push(tempServiceName.map(s => JSON.stringify(s)));
        //     // }
        // }

        if (services) {
            const serviceConditions = services.map(() => `JSON_CONTAINS(p.services, ?)`).join(' OR ');
            query += ` AND (${serviceConditions})`;
            services.forEach(service => {
                params.push(JSON.stringify(service)); // each needs to be a JSON-quoted string
            });
        } else {
            if (couple.services && couple.services.length > 0) {
                const serviceConditions = couple.services.map(() => `JSON_CONTAINS(p.services, ?)`).join(' OR ');
                query += ` AND (${serviceConditions})`;
                couple.services.forEach(service => {
                    params.push(JSON.stringify(service)); // each needs to be a JSON-quoted string
                });
            }
        }
        if (couple.start_date && couple.end_date) {
            query += ` AND pa.start_date <= ? AND pa.end_date >= ?`;
            params.push(couple.end_date, couple.start_date);
        } else {
            if (couple.start_date) {
                query += ` AND pa.start_date >= ?`
                params.push(couple.start_date);
            }

            if (couple.end_date) {
                query += ` AND pa.end_date <= ?`
                params.push(couple.end_date);
            }
        }
        query += ` GROUP BY p.planner_id`;
        const planners = await db.query(query, params);

        res.json({
            success: true,
            planners,
            coupleBudget: couple.total_budget,
        });
    } catch (error) {
        logger.error('List Planners error:', error);
        res.status(500).json({ error: 'Server error while listing planners' });
    }
};

exports.listPlanners_new = async (req, res) => {
    const userId = req.user.user_id;
    const { category, location, minRating, search, services } = req.query;

    try {
        const [couple] = await db.query("SELECT start_date, end_date FROM couples WHERE user_id = ?", [userId]);
        if (!couple) {
            return res.status(404).json({ error: "Invalid User" });
        }

        const baseQuery = `
        SELECT p.planner_id plannerId, p.business_name as businessName, p.location, p.rating, p.services, p.base_price basePrice, p.description, vc.category_name as categoryName 
        FROM planners p
        JOIN categories vc ON p.category_id = vc.category_id
        JOIN planner_availability pa ON p.planner_id = pa.planner_id
        WHERE 1=1
      `;

        const buildQuery = (startDate, endDate) => {
            let query = baseQuery;
            const params = [];

            if (category) {
                query += ' AND p.category_id = ?';
                params.push(category);
            }

            if (location) {
                query += ' AND p.location LIKE ?';
                params.push(`%${location}%`);
            }

            if (minRating) {
                query += ' AND p.rating >= ?';
                params.push(minRating);
            }

            if (search) {
                query += ' AND (p.business_name LIKE ? OR p.services LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            if (services) {
                query += " AND JSON_CONTAINS(p.services, ?)";
                params.push(JSON.stringify(services));
            }

            if (startDate) {
                query += ` AND pa.start_date >= ?`;
                params.push(startDate);
            }

            if (endDate) {
                query += ` AND pa.end_date <= ?`;
                params.push(endDate);
            }

            return { query, params };
        };
        // console.log("E#####:: ", couple.start_date, couple.end_date)
        // Step 1: Try for original range
        let { query, params } = buildQuery(couple.start_date, couple.end_date);
        let planners = await db.query(query, params);

        // Step 2: If no planners, extend to 30 days from original start date
        let fallbackUsed = false;
        if (!planners.length) {
            const start = new Date(couple.start_date);
            const fallbackStart = new Date(start);
            const fallbackEnd = new Date(start);
            fallbackEnd.setDate(fallbackEnd.getDate() + 60);
            ({ query, params } = buildQuery(fallbackStart.toISOString().slice(0, 10), fallbackEnd.toISOString().slice(0, 10)));
            planners = await db.query(query, params);
            fallbackUsed = true;
            console.log('%^&%^', fallbackStart.toISOString().slice(0, 10), fallbackEnd.toISOString().slice(0, 10))
        }

        res.json({
            success: true,
            planners,
            fallbackUsed
        });

    } catch (error) {
        logger.error('List Planners error:', error);
        res.status(500).json({ error: 'Server error while listing planners' });
    }
};


exports.getPlannerDetails = async (req, res) => {
    try {
        const plannerId = req.params.id;

        // Get vendor basic information
        const planner = await db.query(`
          SELECT p.planner_id plannerId, p.category_id categoryId, p.business_name businessName, p.description, p.website, p.location, ROUND(AVG(r.rating), 1) AS rating, p.services, p.base_price basePrice,
                 pc.category_id categoryId, pc.category_name categoryName, u.phone_number phoneNumber, u.email email
          FROM planners p
          JOIN categories pc ON p.category_id = pc.category_id
          JOIN users u ON p.user_id = u.user_id
          LEFT JOIN reviews r ON p.planner_id = r.planner_id
          WHERE p.planner_id = ? GROUP BY p.planner_id
      `, [plannerId]);

        if (planner.length === 0) {
            return res.status(404).json({
                status: 'fail',
                error: 'planner not found'
            });
        }

        // Get planner availability for the next 30 days
        const availability = await db.query(`
          SELECT availability_id availabilityId, start_date startDate, end_date endate, is_available isAvailable FROM planner_availability 
          WHERE planner_id = ? 
          ORDER BY updated_at DESC
      `, [plannerId]);
    //   AND start_date >= CURDATE() AND end_date <= DATE_ADD(CURDATE(), INTERVAL 60 DAY)

        // Combine all information
        const plannerData = {
            ...planner[0],
            availability
        };

        res.status(200).json({
            status: 'success',
            data: plannerData
        });
    } catch (error) {
        console.error('Error fetching planner details:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to fetch planner details'
        });
    }
};

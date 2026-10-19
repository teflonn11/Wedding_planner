const { validationResult } = require('express-validator');
const db = require('../config/database');
const logger = require('../utils/logger');



exports.getCategories = async (req, res) => {
    try {
        const categories = await db.query('SELECT category_id categoryId, category_name categoryName, description FROM categories ORDER BY category_name');

        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: categories
        });
    } catch (error) {
        logger.error('Error fetching categories:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to fetch categories'
        });
    }
};

exports.getServices = async (req, res) => {
    try {
        const category_id = req.query.cid;
        console.log(category_id);
        let categories = [];
        if (!category_id) {
            categories = await db.query('SELECT services FROM categories', []);
        } else {
            categories = await db.query('SELECT services FROM categories WHERE category_id = ?', [category_id]);
        }
        categories = categories.reduce((acc, curr) => acc.concat(curr.services), []);
        res.status(200).json({
            status: 'success',
            results: categories.length,
            data: categories
        });
    } catch (error) {
        logger.error('Error fetching services:', error);
        res.status(500).json({
            status: 'error',
            error: 'Failed to fetch services'
        });
    }
};
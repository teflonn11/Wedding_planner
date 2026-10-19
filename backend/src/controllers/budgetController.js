const db = require('../config/database');
const logger = require('../utils/logger');

// Get predefined budget categories
exports.getCategories = async (req, res, next) => {
    try {
        const [categories] = await db.query(
            'SELECT id, name, description FROM categories WHERE type = ?', 
            ['budget']
        );

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        logger.error('Category retrieval error:', error);
        next(createError(500, 'Error retrieving budget categories'));
    }
};

// Get entire budget for the couple
exports.getBudget = async (req, res, next) => {
    try {
        const [budget] = await db.query(
            `SELECT b.id, b.amount, b.notes, c.name as category_name, b.created_at 
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`, 
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            count: budget.length,
            data: budget
        });
    } catch (error) {
        logger.error('Budget retrieval error:', error);
        next(createError(500, 'Error retrieving budget items'));
    }
};

// Create a new budget item
exports.createBudgetItem = async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        const { categoryId, amount, notes } = req.body;
        
        // Validate input
        if (!categoryId || !amount) {
            return next(createError(400, 'Category and amount are required'));
        }

        // Start transaction
        await connection.beginTransaction();

        // Check if category exists
        const [categories] = await connection.query(
            'SELECT id FROM categories WHERE id = ?', 
            [categoryId]
        );

        if (categories.length === 0) {
            await connection.rollback();
            return next(createError(404, 'Category not found'));
        }

        // Insert budget item
        const [result] = await connection.query(
            'INSERT INTO budgets (user_id, category_id, amount, notes) VALUES (?, ?, ?, ?)', 
            [req.user.id, categoryId, amount, notes]
        );

        // Commit transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                userId: req.user.id,
                categoryId,
                amount,
                notes
            }
        });
    } catch (error) {
        // Rollback transaction in case of error
        await connection.rollback();
        logger.error('Budget item creation error:', error);
        next(createError(500, 'Error creating budget item'));
    } finally {
        connection.release();
    }
};

// Update an existing budget item
exports.updateBudgetItem = async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        const { id } = req.params;
        const { categoryId, amount, notes } = req.body;

        // Start transaction
        await connection.beginTransaction();

        // Check if budget item exists and belongs to user
        const [budgetItems] = await connection.query(
            'SELECT * FROM budgets WHERE id = ? AND user_id = ?', 
            [id, req.user.id]
        );

        if (budgetItems.length === 0) {
            await connection.rollback();
            return next(createError(404, 'Budget item not found or not authorized'));
        }

        // Prepare update query
        const updateFields = [];
        const updateValues = [];

        if (categoryId) {
            // Validate category
            const [categories] = await connection.query(
                'SELECT id FROM categories WHERE id = ?', 
                [categoryId]
            );
            if (categories.length === 0) {
                await connection.rollback();
                return next(createError(404, 'Category not found'));
            }
            updateFields.push('category_id = ?');
            updateValues.push(categoryId);
        }

        if (amount) {
            updateFields.push('amount = ?');
            updateValues.push(amount);
        }

        if (notes) {
            updateFields.push('notes = ?');
            updateValues.push(notes);
        }

        // Add user_id to values to ensure user owns the item
        updateValues.push(id, req.user.id);

        // Perform update if we have fields to update
        if (updateFields.length > 0) {
            await connection.query(
                `UPDATE budgets SET ${updateFields.join(', ')} 
                 WHERE id = ? AND user_id = ?`, 
                updateValues
            );
        }

        // Commit transaction
        await connection.commit();

        // Fetch updated item
        const [updatedItems] = await connection.query(
            'SELECT * FROM budgets WHERE id = ?', 
            [id]
        );

        res.status(200).json({
            success: true,
            data: updatedItems[0]
        });
    } catch (error) {
        // Rollback transaction in case of error
        await connection.rollback();
        logger.error('Budget item update error:', error);
        next(createError(500, 'Error updating budget item'));
    } finally {
        connection.release();
    }
};

// Delete a budget item
exports.deleteBudgetItem = async (req, res, next) => {
    const connection = await db.getConnection();

    try {
        const { id } = req.params;

        // Start transaction
        await connection.beginTransaction();

        // Check if budget item exists and belongs to user
        const [budgetItems] = await connection.query(
            'SELECT * FROM budgets WHERE id = ? AND user_id = ?', 
            [id, req.user.id]
        );

        if (budgetItems.length === 0) {
            await connection.rollback();
            return next(createError(404, 'Budget item not found or not authorized'));
        }

        // Delete the budget item
        await connection.query(
            'DELETE FROM budgets WHERE id = ? AND user_id = ?', 
            [id, req.user.id]
        );

        // Commit transaction
        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Budget item deleted successfully'
        });
    } catch (error) {
        // Rollback transaction in case of error
        await connection.rollback();
        logger.error('Budget item deletion error:', error);
        next(createError(500, 'Error deleting budget item'));
    } finally {
        connection.release();
    }
};

// Get budget summary
exports.getBudgetSummary = async (req, res, next) => {
    try {
        const [summary] = await db.query(`
            SELECT 
                c.name AS category,
                COALESCE(SUM(b.amount), 0) AS total_allocated,
                COALESCE(SUM(e.amount), 0) AS total_spent,
                COALESCE(SUM(b.amount) - SUM(e.amount), 0) AS remaining
            FROM 
                categories c
            LEFT JOIN 
                budgets b ON c.id = b.category_id AND b.user_id = ?
            LEFT JOIN 
                expenses e ON c.id = e.category_id AND e.user_id = ?
            WHERE 
                c.type = 'budget'
            GROUP BY 
                c.id, c.name
        `, [req.user.id, req.user.id]);

        // Calculate overall totals
        const overallSummary = {
            totalAllocated: summary.reduce((sum, item) => sum + item.total_allocated, 0),
            totalSpent: summary.reduce((sum, item) => sum + item.total_spent, 0),
            categories: summary
        };

        res.status(200).json({
            success: true,
            data: overallSummary
        });
    } catch (error) {
        logger.error('Budget summary error:', error);
        next(createError(500, 'Error generating budget summary'));
    }
};
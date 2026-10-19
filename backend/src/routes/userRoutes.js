const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const { rsvpValidation } = require('../middleware/validators');

router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, userController.updateProfile);
router.delete('/account', auth, userController.deleteAccount);
router.get('/notifications', auth, userController.getNotifications);
router.put('/notifications/:id', auth, userController.markNotificationRead);
router.post('/change-password', auth, userController.changePassword);
router.post('/rsvp', rsvpValidation, userController.setRsvp);
router.get('/rsvp', auth, authorize([1]), userController.getRsvp);
router.post('/contactus', userController.contactUs);
router.post('/reviews', auth, authorize([1]), userController.setUserReviews);
router.get('/reviews/vendor/:vendorId', auth, authorize([1]), userController.getVendorReviews);
router.get('/reviews/planner/:plannerId', auth, authorize([1]), userController.getPlannerReviews);
module.exports = router;
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('roleId').isInt().withMessage('Role ID must be an integer'),
  body('phoneNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('gender').notEmpty().withMessage('Gender must be specified'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const coupleValidation = [
  body('partnerName').notEmpty().withMessage('Please provide valid Partner name'),
  body('startDate').notEmpty().withMessage('Start date should not empty'),
  body('endDate').notEmpty().withMessage('End date should not empty'),
  body('location')
    .notEmpty().withMessage('Please provide valid location')
    .isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('guestCount').isInt().withMessage('Guest must be an integer'),
  body('totalBudget').notEmpty().withMessage('Total Budget should not empty'),
  validate
];

const vendorProfileValidation = [
  body('businessName').notEmpty().withMessage('Business Name shouldn\'t empty'),
  body('categoryId').notEmpty().withMessage('Category Id should not empty'),
  body('website').isURL().withMessage('Website url is not valid'),
  body('location').notEmpty().withMessage('Location should not empty'),
  body('services').notEmpty().withMessage('Service Name should not empty'),
  body('basePrice').notEmpty().withMessage('Price should not be empty'),
  body('durationHours').notEmpty().withMessage('Duration should not empty'),
  body('startDate').isDate().withMessage('Please provide valid start date'),
  body('endDate').isDate().withMessage('Please provide valid end date'),
  validate
];

const plannerProfileValidation = [
  body('businessName').notEmpty().withMessage('Business Name shouldn\'t empty'),
  body('categoryId').notEmpty().withMessage('Category Id should not empty'),
  body('website').isURL().withMessage('Website url is not valid'),
  body('location').notEmpty().withMessage('Location should not empty'),
  body('services').notEmpty().withMessage('Service Name should not empty'),
  body('basePrice').notEmpty().withMessage('Price should not be empty'),
  body('startDate').isDate().withMessage('Please provide valid start date'),
  body('endDate').isDate().withMessage('Please provide valid end date'),
  body('durationHours').notEmpty().withMessage('Duration should not empty'),
  validate
];
const vendorServiceValidation = [
  body('services').notEmpty().withMessage('Please provide valid service name'),
  body('basePrice').notEmpty().withMessage('Please provide valid base price'),
  body('durationHours').notEmpty().withMessage('Please provide valid duration'),
  validate
];
const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validate
]

const bookingValidation = [
  // body('vendorId').notEmpty().withMessage('Vendor should not empty'),
  // body('serviceId').notEmpty().withMessage('Service id should not empty'),
  body('bookingDate').isDate().withMessage('Please provide valid date'),
  // body('notes').notEmpty().withMessage('Notes should not be empty'),
  body('totalPrice').notEmpty().withMessage('Total Price should not empty'),
  validate
];

const paymentValidation = [
  body('bookingId').notEmpty().withMessage('Booking id should not empty'),
  body('amount').notEmpty().withMessage('Amount should not empty'),
  body('paymentMethod').notEmpty().withMessage('Payment method should not empty'),
  body('transactionId').notEmpty().withMessage('Transaction id should not empty'),
  // body('status').notEmpty().withMessage('Status should not empty'),
  body('cardDetails').notEmpty().withMessage('Card details should not empty'),
  validate
];

const rsvpValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  // body('address').notEmpty().withMessage('Address should not empty'),
  // body('relationship').notEmpty().withMessage('Relationship should not empty'),
  // body('plusOnes').notEmpty().withMessage('Plus ones should not empty'),
  // body('coupleId').notEmpty().withMessage('Couple id should not empty'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  coupleValidation,
  vendorProfileValidation,
  vendorServiceValidation,
  bookingValidation,
  plannerProfileValidation,
  forgotPasswordValidation,
  rsvpValidation,
  paymentValidation
};
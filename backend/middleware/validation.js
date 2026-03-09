const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Procurement validation
exports.validateProcurement = [
  body('produceName').notEmpty().trim(),
  body('produceType').isIn(['Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']),
  body('tonnage').isNumeric().custom(value => value >= 1000),
  body('cost').isNumeric().custom(value => value >= 10000),
  body('dealerName').isLength({ min: 2 }),
  body('contact').matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),
  body('sellingPrice').isNumeric().custom(value => value >= 1000),
  body('branch').isIn(['Maganjo', 'Matugga']),
  validate
];

// Sale validation
exports.validateSale = [
  body('produceName').notEmpty(),
  body('tonnage').isNumeric().custom(value => value > 0),
  body('amountPaid').isNumeric().custom(value => value >= 10000),
  body('buyerName').isLength({ min: 2 }),
  body('agentName').isLength({ min: 2 }),
  body('branch').isIn(['Maganjo', 'Matugga']),
  validate
];

// Credit sale validation
exports.validateCreditSale = [
  body('buyerName').isLength({ min: 2 }),
  body('nationalId').matches(/^[A-Z0-9]{10,15}$/).withMessage('Invalid National ID'),
  body('location').isLength({ min: 2 }),
  body('contact').matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),
  body('amountDue').isNumeric().custom(value => value >= 10000),
  body('agentName').isLength({ min: 2 }),
  body('dueDate').isISO8601(),
  body('produceName').notEmpty(),
  body('produceType').isIn(['Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']),
  body('tonnage').isNumeric().custom(value => value > 0),
  body('branch').isIn(['Maganjo', 'Matugga']),
  validate
];
/**
 * ============================================
 * KGL Enterprise System - Backend Utilities
 * Helper Functions Module
 * ============================================
 */

const crypto = require('crypto');
const moment = require('moment');

/**
 * ============================================
 * FORMATTING FUNCTIONS
 * ============================================
 */

/**
 * Format currency to UGX
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'UGX 0';
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Date format (default: 'DD/MM/YYYY')
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return 'N/A';
  const momentDate = moment(date);
  
  const formats = {
    'DD/MM/YYYY': 'DD/MM/YYYY',
    'MM/DD/YYYY': 'MM/DD/YYYY',
    'YYYY-MM-DD': 'YYYY-MM-DD',
    'full': 'DD MMMM YYYY',
    'short': 'DD MMM YYYY',
    'time': 'HH:mm:ss',
    'datetime': 'DD/MM/YYYY HH:mm',
    'iso': momentDate.toISOString()
  };
  
  return momentDate.format(formats[format] || format);
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: +256 XXX XXX XXX
  if (cleaned.length === 9) {
    return `+256 ${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 10) {
    return `+256 ${cleaned.slice(1,4)} ${cleaned.slice(4,7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * ============================================
 * VALIDATION FUNCTIONS
 * ============================================
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Ugandan format)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
const isValidPhone = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Ugandan numbers: 9 or 10 digits, starting with 0 or 256
  return /^(?:0|256)?[0-9]{9}$/.test(cleaned);
};

/**
 * Validate National ID (NIN)
 * @param {string} nin - NIN to validate
 * @returns {boolean} True if valid
 */
const isValidNIN = (nin) => {
  // Ugandan NIN format: CM or CF followed by 8-13 digits
  const ninRegex = /^(CM|CF)[0-9]{8,13}$/;
  return ninRegex.test(nin);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 0,
    errors: []
  };

  if (!password) {
    result.errors.push('Password is required');
    return result;
  }

  // Length check
  if (password.length < 6) {
    result.errors.push('Password must be at least 6 characters');
  } else {
    result.strength += 1;
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    result.strength += 1;
  } else {
    result.errors.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    result.strength += 1;
  } else {
    result.errors.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    result.strength += 1;
  } else {
    result.errors.push('Password must contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.strength += 1;
  }

  result.isValid = result.errors.length === 0;
  return result;
};

/**
 * Validate date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} True if valid range
 */
const isValidDateRange = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return start.isValid() && end.isValid() && end.isSameOrAfter(start);
};

/**
 * Validate business registration number
 * @param {string} regNo - Registration number
 * @returns {boolean} True if valid
 */
const isValidBusinessReg = (regNo) => {
  // Ugandan business registration format
  const regRegex = /^[A-Z0-9]{5,15}$/;
  return regRegex.test(regNo);
};

/**
 * ============================================
 * GENERATION FUNCTIONS
 * ============================================
 */

/**
 * Generate random token
 * @param {number} length - Token length
 * @returns {string} Generated token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate random password
 * @param {number} length - Password length
 * @returns {string} Generated password
 */
const generatePassword = (length = 10) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Generate unique invoice number
 * @param {string} prefix - Invoice prefix
 * @returns {string} Generated invoice number
 */
const generateInvoiceNumber = (prefix = 'INV') => {
  const date = moment().format('YYYYMMDD');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${date}-${random}`;
};

/**
 * Generate transaction reference
 * @returns {string} Transaction reference
 */
const generateTransactionRef = () => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN-${timestamp}-${random}`;
};

/**
 * Generate API key
 * @returns {string} API key
 */
const generateApiKey = () => {
  const prefix = 'kgl';
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * ============================================
 * CALCULATION FUNCTIONS
 * ============================================
 */

/**
 * Calculate days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Days difference
 */
const daysBetween = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.diff(start, 'days');
};

/**
 * Calculate age from date of birth
 * @param {Date} dob - Date of birth
 * @returns {number} Age in years
 */
const calculateAge = (dob) => {
  return moment().diff(moment(dob), 'years');
};

/**
 * Calculate tax amount
 * @param {number} amount - Base amount
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} Tax amount
 */
const calculateTax = (amount, taxRate = 18) => {
  return (amount * taxRate) / 100;
};

/**
 * Calculate profit margin
 * @param {number} cost - Cost price
 * @param {number} sellingPrice - Selling price
 * @returns {object} Profit and margin
 */
const calculateProfit = (cost, sellingPrice) => {
  const profit = sellingPrice - cost;
  const margin = (profit / sellingPrice) * 100;
  return {
    profit,
    margin: parseFloat(margin.toFixed(2))
  };
};

/**
 * Calculate compound growth
 * @param {number} initial - Initial value
 * @param {number} rate - Growth rate percentage
 * @param {number} periods - Number of periods
 * @returns {number} Final value
 */
const calculateCompoundGrowth = (initial, rate, periods) => {
  return initial * Math.pow(1 + rate / 100, periods);
};

/**
 * ============================================
 * DATA PROCESSING FUNCTIONS
 * ============================================
 */

/**
 * Paginate array results
 * @param {Array} data - Array to paginate
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} Paginated result
 */
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      total: data.length,
      page,
      limit,
      pages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: startIndex > 0
    }
  };
};

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Sort key
 * @param {string} order - Sort order (asc/desc)
 * @returns {Array} Sorted array
 */
const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Group key
 * @returns {object} Grouped object
 */
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array to process
 * @param {string} key - Key to check for duplicates
 * @returns {Array} Unique array
 */
const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = key ? item[key] : item;
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * ============================================
 * ENCRYPTION FUNCTIONS
 * ============================================
 */

/**
 * Hash string using SHA256
 * @param {string} str - String to hash
 * @returns {string} Hashed string
 */
const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

/**
 * Generate random OTP
 * @param {number} length - OTP length
 * @returns {string} Generated OTP
 */
const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

/**
 * Encode base64
 * @param {string} str - String to encode
 * @returns {string} Base64 encoded string
 */
const base64Encode = (str) => {
  return Buffer.from(str).toString('base64');
};

/**
 * Decode base64
 * @param {string} str - Base64 string to decode
 * @returns {string} Decoded string
 */
const base64Decode = (str) => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

/**
 * ============================================
 * RESPONSE FUNCTIONS
 * ============================================
 */

/**
 * Create success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {object} Formatted response
 */
const successResponse = (data = null, message = 'Operation successful') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create error response
 * @param {string} message - Error message
 * @param {number} code - Error code
 * @param {*} details - Error details
 * @returns {object} Formatted error response
 */
const errorResponse = (message = 'An error occurred', code = 500, details = null) => {
  return {
    success: false,
    message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create paginated response
 * @param {Array} data - Page data
 * @param {object} pagination - Pagination info
 * @returns {object} Formatted paginated response
 */
const paginatedResponse = (data, pagination) => {
  return {
    success: true,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
};

/**
 * ============================================
 * LOGGING FUNCTIONS
 * ============================================
 */

/**
 * Log to console with timestamp
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {*} data - Additional data
 */
const log = (level, message, data = null) => {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const logEntry = {
    timestamp,
    level,
    message,
    data
  };
  
  switch (level) {
    case 'error':
      console.error(JSON.stringify(logEntry, null, 2));
      break;
    case 'warn':
      console.warn(JSON.stringify(logEntry, null, 2));
      break;
    case 'info':
      console.info(JSON.stringify(logEntry, null, 2));
      break;
    default:
      console.log(JSON.stringify(logEntry, null, 2));
  }
};

/**
 * Log error with stack trace
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
const logError = (error, context = '') => {
  log('error', `${context} ${error.message}`, {
    stack: error.stack,
    name: error.name
  });
};

/**
 * ============================================
 * EXPORTS
 * ============================================
 */

module.exports = {
  // Formatting
  formatCurrency,
  formatDate,
  formatPhone,
  formatFileSize,
  formatNumber,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidNIN,
  validatePassword,
  isValidDateRange,
  isValidBusinessReg,
  
  // Generation
  generateToken,
  generatePassword,
  generateInvoiceNumber,
  generateTransactionRef,
  generateApiKey,
  
  // Calculation
  daysBetween,
  calculateAge,
  calculateTax,
  calculateProfit,
  calculateCompoundGrowth,
  
  // Data Processing
  paginate,
  sortByKey,
  groupBy,
  uniqueBy,
  
  // Encryption
  hashString,
  generateOTP,
  base64Encode,
  base64Decode,
  
  // Response
  successResponse,
  errorResponse,
  paginatedResponse,
  
  // Logging
  log,
  logError
};
// 'use strict';

// module.exports = {
//   PORT: process.env.PORT || 8080,
//   CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
//   DATABASE_URL:
//         process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',
//   TEST_DATABASE_URL:
//         process.env.TEST_DATABASE_URL ||
//         'mongodb://localhost/thinkful-backend-test'
//   // DATABASE_URL:
//   //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
//   // TEST_DATABASE_URL:
//   //     process.env.TEST_DATABASE_URL ||
//   //     'postgres://localhost/thinkful-backend-test'
// };


'use strict';
require('dotenv').config();
exports.CLIENT_ORIGIN =  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
exports.DATABASE_URL = process.env.DATABASE_URL || 'http://localhost:8080';//put DATABASE_URL in heroku
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'http://localhost:8080';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '60min';
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = mysql.createConnection(
     {
          host: 'localhost',
          user: 'root',
          password: process.env.MYSQL_PASS,
          database: 'employeeTracker_db'
     },
     console.log('connected')
);

module.exports = db;
/*inquire(checkbox)
1. view all department/role/employee --> select*from
2. add department/role/employee --> insert into
3. update employee --> update set where
*/


const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection(
     {
          host: 'localhost',
          user: 'root',
          password: process.env.MYSQL_PASS,
          database: 'employeeTracker_db'
     },
     console.log('conected')
);

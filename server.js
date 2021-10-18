/*inquire(checkbox)
1. view all department/role/employee --> select*from
2. add department/role/employee --> insert into
3. update employee --> update set where
*/


const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const viewClass = require('./helper/viewData');
const viewData = new viewClass('employeeTracker');
const addDepartment = require('./helper/addDepartment')


//addDepartment('newd');
viewData.viewDepartments();
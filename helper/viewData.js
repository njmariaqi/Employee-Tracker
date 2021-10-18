const mysql = require('mysql2');
const db = require('./db');
const cTable = require('console.table');

class ViewData {
     constructor(data) {
          this.data = data;
     }
     viewDepartments() {
          db.query('SELECT*FROM departments', (err, res) => console.table(res));
          }
     viewRoles() {
          db.query(`SELECT
          roles.id,
          roles.title,
          roles.salary,
          departments.name AS department_name
          FROM roles 
          INNER JOIN departments 
          ON roles.department_id = departments.id`, (err, res) => console.table(res));
     }
     viewEmployees() {
          db.query(`
          SELECT
          employees.id,
          first_name,
          last_name,
          title,
          name AS department_name
          FROM employees 
          LEFT JOIN roles ON employees.role_id = roles.id
          LEFT JOIN departments ON roles.department_id = departments.id
          `, 
          (err, res) => console.table(res));
     }
} 

module.exports = ViewData;
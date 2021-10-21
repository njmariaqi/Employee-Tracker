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
          t1.id,
          t1.first_name,
          t1.last_name,
          title,
          name AS department_name,
          concat(t1.first_name, ' ',t1.last_name) AS manager_name
          FROM employees t1
          LEFT JOIN roles ON t1.role_id = roles.id
          LEFT JOIN departments ON roles.department_id = departments.id
          INNER JOIN employees t2 ON t1.id = t2.manager_id
          `, 
          (err, res) => console.table(res));
     }
} 

module.exports = ViewData;
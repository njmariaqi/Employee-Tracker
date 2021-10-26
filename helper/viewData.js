const db = require('./db');
//const cTable = require('console.table');
//const mainMenu = require('./mainMenu');

class ViewClass {
     constructor(data) {
          this.data = data;
     }
     viewDepartments() {
          db.promise().query('SELECT*FROM departments')
          .then(res => {
               console.table(res[0]);
          })
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
          t2.id,
          t2.first_name,
          t2.last_name,
          title,
          name AS department_name,
          concat(t1.first_name, ' ',t1.last_name) AS manager_name
          FROM employees t1
          INNER JOIN employees t2 ON t1.id = t2.manager_id
          LEFT JOIN roles ON t2.role_id = roles.id
          LEFT JOIN departments ON roles.department_id = departments.id
          `, 
          (err, res) => console.table(res));
     }
} 

const viewData = new ViewClass('employeeTracker_db');
viewData.viewEmployees();


//module.exports = ViewClass;
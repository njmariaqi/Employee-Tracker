const inquirer = require('inquirer');
const db = require('../db');

function addDepartment() {
     inquirer
     .prompt([
          {
               name: 'department_name',
               type: 'input',
               message: 'What department do you want to add?'
          }
     ])
     .then(res => {
          const departmentName = res.department_name;
          db.query(`INSERT INTO departments (name)
          VALUES
          ('${departmentName}')`, (err, res) => {
               if (err) {
                    console.error(err);
               } else {
                    console.log(`new department of ${departmentName} is added!`)
               }
     });
     })     
}

module.exports = addDepartment;
const db = require('./db');
const inquirer = require('inquirer');

function addEmployee() {
     const newEmployee = [];
     inquirer
          .prompt([
               {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is the first name of the role?'
               }
          ])
          .then((res) => {
               newEmployee.push(res);
               inquirer
                    .prompt([
                         {
                              name: 'last_name',
                              type: 'input',
                              message: 'What is the last name of the role?'
                         }
                    ])
                    .then((res) => {
                         newEmployee.push(res);
                         db.promise().query(`SELECT title FROM roles`)
                    .then((res) => {
                         inquirer
                         .prompt([
                              {
                                   name: 'title',
                                        type: 'checkbox',
                                        message: 'What role do you want to assign to this employee?',
                                        choices: res[0].map(x => x.name)
                              }
                         ])
                         .then((res) => {
                              newEmployee.push (res)
                              db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)`)
                         })
                    })
          })
})
}

module.exports = addEmployee;
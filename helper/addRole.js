const db = require('./db');
const inquirer = require('inquirer');

function addRole() {
     const newRole = [];
     inquirer
          .prompt([
               {
                    name: 'name',
                    type: 'input',
                    message: 'What is the name of the role?'
               }
          ])
          .then((res) => {
               newRole.push(res.name);
               inquirer
                    .prompt([
                         {
                              name: 'salary',
                              type: 'input',
                              message: 'What is the salary of the role?'
                         }
                    ])
                    .then((res) => {
                         newRole.push(parseInt(res.salary));
                         return db.promise().query(`SELECT name FROM departments`)
                    .then((res) => {
                         inquirer
                         .prompt([
                              {
                                   name: 'department',
                                        type: 'checkbox',
                                        message: 'What department does this role belong to?',
                                        choices: res[0].map(x => x.name)
                              }
                         ])
                         .then((res) => {
                              return db.promise().query(`SELECT id
                              FROM departments
                              WHERE name = '${res.department}'`)
                         })
                         .then ((res) => {
                              newRole.push(res[0][0].id);
                              console.log(newRole);
                              db.promise().query(`INSERT INTO roles (title, salary, department_id)
                              VALUES
                              ('${newRole[0]}',${newRole[1]}, ${newRole[2]})`)
                         })
                    })
          })
})
}

addRole();
module.exports = addRole;
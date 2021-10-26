const db = require('../db');
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
               newEmployee.push(res.first_name);
               inquirer
                    .prompt([
                         {
                              name: 'last_name',
                              type: 'input',
                              message: 'What is the last name of the role?'
                         }
                    ])
                    .then((res) => {
                         newEmployee.push(res.last_name);
                         return db.promise().query(`SELECT title FROM roles`)
                    .then((res) => {
                         inquirer
                         .prompt([
                              {
                                   name: 'title',
                                   type: 'checkbox',
                                   message: 'What role do you want to assign to this employee?',
                                   choices: res[0].map(x => x.title)
                              }
                         ])
                         .then((res) => {
                              return db.promise().query(`SELECT id
                              FROM roles
                              WHERE title = '${res.title}'`)
                         })
                         .then ((res) => {
                              newEmployee.push(res[0][0].id);
                              return db.promise().query(`
                              SELECT
                              concat(t1.first_name, ' ', t1.last_name) AS manager_name
                              FROM employees t1`)
                         })
                         .then ((res) => {
                              inquirer
                              .prompt([
                                   {
                                        name: 'manager',
                                        type: 'checkbox',
                                        message: 'What is the manager of this employee?',
                                        choices: res[0].map(x => x.manager_name)
                                   }
                              ])
                              .then((res) => {
                                   return db.promise().query(`SELECT id
                                   FROM employees
                                   WHERE first_name = '${res.manager[0].split(' ')[0]}'`)
                              }) 
                              .then ((res) => {
                                   newEmployee.push(res[0][0].id);
                                   console.log(newEmployee);
                                   db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                   VALUES
                                   ('${newEmployee[0]}','${newEmployee[1]}', '${newEmployee[2]}', '${newEmployee[3]}')`)
                              })
                              .then(res => console.log('new employee added!'))
                              .catch(err => console.error(err))
                         })
                         
                    })
          })
})
}

function updateRole() {
     return db.promise().query(`SELECT concat(first_name, ' ',last_name) AS name FROM employees`)
     .then((res) => {
          inquirer
          .prompt([
               {
                    name: 'update_name',
                         type: 'checkbox',
                         message: 'Who do you want to update?',
                         choices: res[0].map(x => x.name)
               }
          ])
          .then((res) => {
               const selectedEmployee = res.update_name;
               return db.promise().query(`SELECT title FROM roles`)
               .then((res) => {
                    inquirer
                    .prompt([
                         {
                              name: 'title',
                              type: 'checkbox',
                              message: 'What role do you want to assign to this employee?',
                              choices: res[0].map(x => x.title)
                         }
                    ])
                    .then((res) => {
                         return db.promise().query(`SELECT id
                         FROM roles
                         WHERE title = '${res.title}'`)
                    })
                    .then ((res) => {
                         console.log(selectedEmployee[0].split(' ')[0]);
                         return db.promise().query(`
                         UPDATE employees
                         SET role_id = ${res[0][0].id}
                         WHERE first_name = '${selectedEmployee[0].split(' ')[0]}';
                         `)
                    })
                    .then(res => console.log('employee role updated!'))
                    .catch(err => console.error(err))
                    
               })
          })
     })
}

updateRole();

//module.exports = addEmployee;
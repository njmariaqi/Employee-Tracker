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
                                   db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                   VALUES
                                   ('${newEmployee[0]}',${newEmployee[1]}, ${newEmployee[2]}, ${newEmployee[3]})`)
                              })
                              .then(res => console.log('new employee added!'))
                              .catch(err => console.error(err))
                         })
                         
                    })
          })
})
}

addEmployee();

//module.exports = addEmployee;
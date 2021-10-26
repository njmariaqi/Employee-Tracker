const inquirer = require('inquirer');
const db = require('./db');

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


function addEmployee() {
     const newEmployee = [];
     inquirer
          .prompt([
               {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is the first name of the employee?'
               }
          ])
          .then((res) => {
               newEmployee.push(res.first_name);
               inquirer
                    .prompt([
                         {
                              name: 'last_name',
                              type: 'input',
                              message: 'What is the last name of the employee?'
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



module.exports = {
     'addDepartment': addDepartment , 
     'addRole': addRole, 
     'addEmployee': addEmployee
}
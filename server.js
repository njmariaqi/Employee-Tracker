const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./helper/db');
const cTable = require('console.table');

function mainMenu() {
     inquirer
     .prompt([
          {
               name: 'main',
               type: 'checkbox',
               message: 'What do you want to do?',
               choices:[
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role'
               ]
          }
     ])
     .then (res => {
          switch(res.main[0]) {
               case 'view all departments':
                    viewDepartments();
                    break;
               case 'view all roles':
                    viewRoles();
                    break;
               case 'view all employees':
                    viewEmployees();
                    break;
               case 'add a department':
                    addDepartment();
                    break;
               case 'add a role':
                    addRole();
                    break;
               case 'add an employee':
                    addEmployee();
                    break;
               case 'update an employee role':
                    updateRole();
                    break;
          }
     })
}

function viewDepartments() {
     db.promise().query('SELECT*FROM departments')
     .then(res => {
          console.table(res[0]);
          return res;
     })
     .then(() => mainMenu())
}

function viewRoles() {
     db.query(`SELECT
     roles.id,
     roles.title,
     roles.salary,
     departments.name AS department_name
     FROM roles 
     INNER JOIN departments 
     ON roles.department_id = departments.id`, (err, res) => {
          console.table(res);
          mainMenu();
     });
}

function viewEmployees() {
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
     (err, res) => {
          console.table(res);
          mainMenu();
     });
}

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
          db.promise().query(`INSERT INTO departments (name)
          VALUES
          ('${departmentName}')`)
          .then(res => console.log('new department added!'))
          .catch(err => console.error(err))
          .then(() => mainMenu())  
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
                              db.promise().query(`INSERT INTO roles (title, salary, department_id)
                              VALUES
                              ('${newRole[0]}',${newRole[1]}, ${newRole[2]})`)
                         })
                         .then(res => {
                              console.log('new role added!')
                              mainMenu();
                         })
                         .catch(err => console.error(err))   
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
                                        message: 'Who is the manager of this employee?',
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
                                   ('${newEmployee[0]}', '${newEmployee[1]}', '${newEmployee[2]}', '${newEmployee[3]}')`)
                              })
                              .then(res => console.log('new employee added!'))
                              .catch(err => console.error(err))
                              .then(() => mainMenu())  
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
                    .then(() => mainMenu())
               })
          })
     })
}

mainMenu();
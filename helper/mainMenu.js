const inquirer = require('inquirer');
const ViewClass = require('./viewData');
const viewData = new ViewClass('employeeTracker_db');
const {addDepartment, addRole, addEmployee} = require('./addData');


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
                    viewData.viewDepartments();
                    break;
               case 'view all roles':
                    viewData.viewRoles();
                    break;
               case 'view all employees':
                    viewData.viewEmployees();
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
                    console.log('later');
                    break;
          }
     })
}

module.exports = mainMenu;

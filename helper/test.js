const db = require('./db');
//const inquirer = require('inquirer');

db.promise().query(`
SELECT id
FROM departments
WHERE name = 'architect'`)
.then(res => {
console.log(res[0])
})
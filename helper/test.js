const db = require('./db');
//const inquirer = require('inquirer');

db.promise().query(`SELECT
t1.first_name,
t1.last_name
FROM employees t1
INNER JOIN employees t2 ON t1.id = t2.manager_id`)
.then(res => {
console.log(res[0])
})
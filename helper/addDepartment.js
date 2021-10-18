const db = require('./db');
const viewClass = require('./viewData');
const viewData = new viewClass('employeeTracker');

function addDepartment(departmentName) {
     db.query(`INSERT INTO departments (name)
          VALUES
          ('${departmentName}')`, (err, res) => {
               if (err) {
                    console.error(err);
               } else {
                    console.log(`new department of ${departmentName} is added!`)
               }
     });
}

module.exports = addDepartment;
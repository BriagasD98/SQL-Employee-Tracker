// Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
// Establishes connection with database in seperate file
const connection = require('./config/connection');
const db = require('./config/connection');

connection.connect(err => {
    if (err) throw err;
    promptUser();
  });

// Questions Array; This will be prompted after successful connection
const promptUser = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View all Departments', 
                  'View all Roles', 
                  'View all Employees', 
                  'Add a Department', 
                  'Add a Role', 
                  'Add an Employee', 
                  'Update an Employee Role',
                  'No Action']
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === 'View all Departments') {
          showDepartments();
        }
  
        if (choices === 'View all Roles') {
          showRoles();
        }
  
        if (choices === 'View all Employees') {
          showEmployees();
        }
  
        if (choices === 'Add a Department') {
          addDepartment();
        }
  
        if (choices === 'Add a Role') {
          addRole();
        }
  
        if (choices === 'Add an Employee') {
          addEmployee();
        }
  
        if (choices === 'Update an Employee Role') {
          updateEmployee();
        }
  
        if (choices === 'No Action') {
          connection.end()
      };
    });
  };

// Shows all Departments
function showDepartments() {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    }) 
};

function showRoles() {
    const sql = `SELECT role.id, role.title,
            department.name AS department FROM role
            INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};

function showEmployees() {
    const sql = `SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            role.title, 
            department.name AS department,
            role.salary, 
            CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};

function addDepartment() {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!"); 
  
          showDepartments();
      });
    });
  };
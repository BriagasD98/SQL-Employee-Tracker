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
                  'EXIT Employee Database']
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
  
        if (choices === 'EXIT Employee Database') {
          connection.end();
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

// Shows all Roles
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

// Show all Employees
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

// Add a Department
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

// Add a Role
function addRole() {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addRole',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'addSalary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if (addSalary) {
              return true;
          } else {
              console.log('Please enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.addRole, answer.addSalary];
  
        // choose Department from EXISTING Departments
        const roleSql = `SELECT name, id FROM department`; 
  
        db.query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.addRole + " to roles!"); 
  
                showRoles();
         });
       });
     });
   });
  };

// Add an Employee
function addEmployee() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'addFirst',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'addLast',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.addFirst, answer.addLast]
  
      // grab existing roles from roles table
      const roleSql = `SELECT role.id, role.title FROM role`;
    
      db.query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                db.query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      db.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log(answer.addFirst + " has been added to Employees!")
  
                      showEmployees();
                });
              });
            });
          });
       });
    });
  };

// Update an Employee Role
function updateEmployee() {
    // get existing employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          db.query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log("Employee Role has been updated!");
                
                  showEmployees();
            });
          });
        });
      });
    });
  };
  
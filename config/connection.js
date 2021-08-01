const mysql = require('mysql2');
require('dotenv').config();

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database:'EmployeeTracker_db',
        port: 3306
    },
    console.log('Connected to the Employee database!')
);

db.connect(function (err) {
    if (err) throw err
});

module.exports = db;
// src/database.js
const mysql = require('mysql2');  

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       
    password: '', 
    database: 'db_hayak',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); 

// Ekspor pool dengan API promise
module.exports = pool;  // Pastikan menggunakan promise()

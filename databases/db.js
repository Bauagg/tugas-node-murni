const mysql = require('mysql');

// Konfigurasi MySQL
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Ganti dengan username MySQL Anda
    password: 'root', // Ganti dengan password MySQL Anda
    database: 'databes-test' // Ganti dengan nama database yang sesuai
});

// Koneksi ke MySQL
dbConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + dbConnection.threadId);
});

module.exports = dbConnection;

const mysql = require('mysql');

const connection = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    
});

connection.connect(()=>{
    try {
        console.log('conecction sucessfull');
    } catch (err) {
        console.error(err);
    }
});

module.exports = connection;
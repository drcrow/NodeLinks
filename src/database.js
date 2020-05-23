const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION LOST');
        }else if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }else if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION REFUSED');
        }else{
            console.error(err.code);
        }

    }

    if(conn){
        conn.release();
        console.log('DATABASE CONNECTED!');
        return;
    }
});

// mysql usa callbacks
// promisify hace que podamos usar promesas
pool.query = promisify(pool.query);
module.exports = pool;
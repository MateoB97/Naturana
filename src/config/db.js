const mysql = require('mysql');

const db_config ={

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    
};

let connection;
  
function handleDisconnect() {
  
  connection = mysql.createPool(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.getConnection(function(err) {              // The server is either down
    console.log('connection success');
    if(err) {                                     // or restarting (takes a while sometimes).
    console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                                // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        
    console.log('db error', err);

        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
        }
  });
}

handleDisconnect();


// connection.connect((err)=>{
//   try {
//     console.log('connection success');
//   } catch (error) {
//     console.error(`Error del try ${error}`);
//     console.error(`Error de la concection ${error}`);
//   }
// });


module.exports = connection;
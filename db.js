
// -----------Importing Node Modules

const mysql = require('mysql2');
require('dotenv').config();


//----------- db connection function 

// const dbconnection = () => {
   
    const con = mysql.createConnection({
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpassword,
        database: process.env.dbdatabase,
        multipleStatements: true
    })

    con.connect((err)=>{
        if(err) {
            console.log(err)
        } else {
            console.log(con.config.database," Database is connected");
        }
    })
  
    // return con;
// }

module.exports = con;
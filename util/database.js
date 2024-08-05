const config = require ('../config/config.json');
mysql = require ('mysql');

const conn = mysql.createConnection ({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    port: config.port
});
conn.connect((err) => {
    if (err) {
        console.log(`There was a problem establishing the connection. Check the actual error: -> ${ err }`);
        // res.status(500).send({error: "There was an error establishing a connnection"});
    }else{
        console.log("connected to the database successfully");
    }
});

module.exports = conn;
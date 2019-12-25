var mysql = require('mysql');

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root"
});

connection.connect(function(err) {
	if (err)
		throw err;
    console.log("connection established.");

    var sqlQ = "CREATE DATABASE IF NOT EXIST notes;";    
    connection.query(sqlQ, function (err, result) {
        if (err)
            throw err;
        console.log("Init-1");
    });
    
    var sqlQ = "USE notes;";    
    connection.query(sqlQ, function (err, result) {
        if (err)
            throw err;
        console.log("Init-2");
    });

    sqlQ = "CREATE TABLE IF NOT EXISTS test (title TINYTEXT, data TEXT, creation TIMESTAMP, modified TIMESTAMP);";
    connection.query(sqlQ, function (err, result) {
        if (err)
            throw err;
        console.log("Init-3");
    }); 
});

function executeSQLQuery (sql, consoleLogMessage) {
    connection.query(sql, function(err, result){
        if (err)
            throw err;
        if (consoleLogMessage != "")
            console.log(consoleLogMessage);
    });
}
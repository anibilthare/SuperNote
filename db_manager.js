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
});

/// INITIALIZE THE DATABASE
(function() {
    var sqlQ = "CREATE DATABASE IF NOT EXISTS notes;";
    executeSQLQuery(sqlQ, "Init-1");
    
    sqlQ = "USE notes;";
    executeSQLQuery(sqlQ, "Init-2");

    sqlQ = "CREATE TABLE IF NOT EXISTS test (title TINYTEXT, data TEXT, creation TIMESTAMP, modified TIMESTAMP);";
    executeSQLQuery(sqlQ, "Init-3");
})();
///

function executeSQLQuery (sql, consoleLogMessage) {
    connection.query(sql, function(err, result){
        if (err)
            throw err;
        if (consoleLogMessage != "")
            console.log(consoleLogMessage);
    });
}

/**/connection.end(function(err){
    if (err)
        throw err;
    console.log("Connection closed.");
});//*/
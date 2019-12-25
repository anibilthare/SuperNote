var mysql = require('mysql');

var connection = mysql.createConnection({
	host: "",
	user: "",
	password: ""
});

connection.connect(function(err) {
	if (err)
		throw err;
	console.log("connection established.");
});

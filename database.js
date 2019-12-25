const mysql = require('mysql');


module.exports = {

    /// properties_and_deprecated_functions {

    connection: null,
    USER_TABLE_STR: "username VARCHAR(50) PRIMARY KEY, password VARCHAR(25), name VARCHAR(50)",
    NOTE_TABLE_STR: "title varchar(100), note TEXT, creation TIMESTAMP PRIMARY KEY, modified TIMESTAMP",
    
    __executeSQLQuery: function (sql, consoleLogMessage) { //!// deprecated external usage
        this.connection.query(sql, function(err, result){
            if (err)
                throw err;
            if (consoleLogMessage != "")
                console.log(consoleLogMessage);
        });
    },

    /// }

    /// functions {
    
    set_connection: function (_host, _user, _password) {
        this.connection = mysql.createConnection({
            host: _host,
            user: _user,
            password: _password
        });
    },

    initialise: function () {
        this.connection.connect(function(err) {
            if (err)
                throw err;
            console.log("Connection established.");
        });

        /// MAIN INIT PROCEDURE {
        var sqlQ = "CREATE DATABASE IF NOT EXISTS supernote;";
        this.__executeSQLQuery(sqlQ, "Init-1");
        
        sqlQ = "USE supernote;";
        this.__executeSQLQuery(sqlQ, "Init-2");

        sqlQ = "CREATE TABLE IF NOT EXISTS users (" + this.USER_TABLE_STR + ");";
        this.__executeSQLQuery(sqlQ, "Init-3");
        /// }
    },

    login: function (username, pass) {
        _username = this.connection.escape(username);
        _pass = this.connection.escape(pass);

        this.connection.query("SELECT password FROM users WHERE username = " + "'" + username + "';",
                                function(err, result, fields){
                                    if (result[0].password == _pass)
                                        
                                }
        );
    },

    newNote: function () {

    }

    /// }
};
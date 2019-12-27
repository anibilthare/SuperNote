const mysql = require('mysql');


module.exports = {

    /// properties_and_deprecated_functions {

    connection_set: false,
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
        this.connection_set = true;
    },

    initialise: function () {
        if (!this.connection_set) {
            console.log("Please set up connection first.");
            return;
        }
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

        //this.connection.end();
    },

    create_user: function (username, pass, name) {
        var sqlQ = "INSERT INTO users VALUES ('" + username + "', '" + pass + "', '" + name + "');";
        this.__executeSQLQuery(sqlQ, "NEW USR CREATED-1");

        sqlQ = "CREATE TABLE " + username + " (" + this.NOTE_TABLE_STR + ");";
        this.__executeSQLQuery(sqlQ, "NEW USR CREATED-2");
    },

    login: function (username, pass) {
        _username = this.connection.escape(username);
        _pass = this.connection.escape(pass);
        var success = false;

        this.connection.query("SELECT password FROM users WHERE username = '" + _username + "';",
            function(err, result, fields) {
                if (result[0].password == _pass) {
                    success = true;
                }
            }
        );

        return success;
    },

    newNote: function (username, pass, note, title, timestamp) {
        if (this.login(username, pass)) {
            var sqlQ = "INSERT INTO " + username + " values ('" + title + "', '" + note + "', " + timestamp + ", " + timestamp + ");";
            this.__executeSQLQuery(sqlQ, "NEW NOTE ADDED");
        }
    },


    end_connection: function() {
        this.connection.end();
    }

    /// }
};
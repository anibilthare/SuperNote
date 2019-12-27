const mysql = require('mysql');


module.exports = {

    /// properties_and_internal_functions {

    CONNECTION_SET: false,
    USER_TABLE_STR: "username VARCHAR(50) PRIMARY KEY, password VARCHAR(25), name VARCHAR(50)",
    NOTE_TABLE_STR: "title varchar(100), note TEXT, creation TIMESTAMP PRIMARY KEY, modified TIMESTAMP",
    
    __executeSQLQuery: function (sql, consoleLogMessage) { //!// internal usage only
        this.connection.query(sql, function(err, result) {
            if (err)
                throw err;
            if (consoleLogMessage != "")
                console.log("database API > " + consoleLogMessage);
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
        this.CONNECTION_SET = true;
    },

    initialise: function () {
        if (!this.CONNECTION_SET) {
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
    },

    check_username: function (username) {
        _username = this.connection.escape(username);
        this.connection.query("SELECT * FROM users WHERE username = " + _username + ";",
            function(err, result, fields) {
                if (result.length !== 0) { /// !== because type safe check required here
                    return true;
                }
            }
        );
        return false;
    },

    create_user: function (username, pass, name) {
        if (this.check_username(username))
            return false;

        _username = this.connection.escape(username);
        _pass = this.connection.escape(pass);
        _name = this.connection.escape(name);

        var sqlQ = "INSERT INTO users VALUES (" + _username + ", " + _pass + ", " + _name + ");";
        this.__executeSQLQuery(sqlQ, "NEW USR CREATED-1");

        sqlQ = "CREATE TABLE " + _username.substring(1, _username.length - 1) + " (" + this.NOTE_TABLE_STR + ");"; /// escaped string comes with single quotes
        this.__executeSQLQuery(sqlQ, "NEW USR CREATED-2");

        return true;
    },

    login: function (username, pass) {
        _username = this.connection.escape(username);
        _pass = this.connection.escape(pass);
        var success = false;

        this.connection.query("SELECT password FROM users WHERE username = " + _username + ";",
            function(err, result, fields) {
                if (result[0].password == _pass) {
                    success = true;
                }
            }
        );

        return success;
    },

    newNote: function (username, pass, note, title, timestamp) {
        _username = this.connection.escape(username);
        _pass = this.connection.escape(pass);
        _note = this.connection.escape(note);
        _title = this.connection.escape(title);
        _timestamp = this.connection.escape(timestamp);

        if (this.login(username, pass)) {
            var sqlQ = "INSERT INTO " + _username + " values (" + _title + ", " 
                + _note + ", " + _timestamp + ", " + _timestamp + ");";
            this.__executeSQLQuery(sqlQ, "NEW NOTE ADDED");
        }
    },


    end_connection: function() {
        this.connection.end();
    }

    /// }
};
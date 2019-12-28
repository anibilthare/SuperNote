const mysql = require('mysql');


module.exports = {

    /// properties_and_internal_functions {

    __CONNECTION_SET: false,
    __USER_TABLE_STR: "username VARCHAR(50) PRIMARY KEY, password VARCHAR(25), name VARCHAR(50)",
    __NOTE_TABLE_STR: "title varchar(100), note TEXT, creation TIMESTAMP PRIMARY KEY, modified TIMESTAMP",
    __LOG_MESSAGE: "database API > ",
    __TRIP: [0,0,0,0],

    
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
        this.__CONNECTION_SET = true;
    },

    initialise: function () {
        if (!this.__CONNECTION_SET) {
            console.log(this.__LOG_MESSAGE + "Please set up connection first.");
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

        sqlQ = "CREATE TABLE IF NOT EXISTS users (" + this.__USER_TABLE_STR + ");";
        this.__executeSQLQuery(sqlQ, "Init-3");
        /// }

        return true;
    },

    check_username: function (username) {
        var _username = this.connection.escape(username);
        var check = false;

        this.connection.query("SELECT * FROM users WHERE username = " + _username + ";",
            function(err, result, fields) {
                if (result.length !== 0) { /// !== because type safe check required here
                    console.log("database API > " + "USERNAME ALREADY EXISTS.");
                    check = true;
                }
            }
        );
        console.log(this.__LOG_MESSAGE + check);
        return check;
    },

    create_user: function (username, pass, name) {
        if (this.check_username(username) == true) {
            console.log(this.__LOG_MESSAGE + "NEW USER REJECTED.");
            return false;
        }

        var _username = this.connection.escape(username);
        var _pass = this.connection.escape(pass);
        var _name = this.connection.escape(name);

        var sqlQ = "INSERT INTO users VALUES (" + _username + ", " + _pass + ", " + _name + ");";
        this.__executeSQLQuery(sqlQ, "NEW USER CREATED-1");

        sqlQ = "CREATE TABLE " + _username.substring(1, _username.length - 1) + " (" + this.__NOTE_TABLE_STR + ");"; /// escaped string comes with single quotes
        this.__executeSQLQuery(sqlQ, "NEW USER CREATED-2");

        return true;
    },

    login: async function (username, pass) {
        var _username = this.connection.escape(username);
        var _pass = this.connection.escape(pass);
        var success = false;
        var __async_func_waiter = false;
        var lallulal = "pappu bhai not rocks.";

        await this.connection.query("SELECT password FROM users WHERE username = " + _username + ";",
            function(err, result, fields) {
                if (err)
                    throw err;
                else if (result[0].password == _pass.substring(1, _pass.length - 1)) {
                    console.log(lallulal);
                    success = true;
                    console.log(result);
                }
                //__async_func_waiter = true;
            }
        );

        //while (!__async_func_waiter) {console.log("waiting bruh!!!");}

        return success;
    },

    newNote: function (username, pass, note, title, timestamp) {
        var _username = this.connection.escape(username);
        var _pass = this.connection.escape(pass);
        var _note = this.connection.escape(note);
        var _title = this.connection.escape(title);
        var _timestamp = this.connection.escape(timestamp);

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
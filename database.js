const mysql = require('mysql');

module.exports = {
    connection: mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root"
    }),

    connect: function () {
        this.connection.connect(function(err) {
            if (err)
                throw err;
            console.log("Connection established.");
        })
    },

    login: function () {

    },

    newNote: function () {

    }
};
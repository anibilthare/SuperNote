var abc = require("./database");

abc.set_connection("localhost", "root", "root");
abc.initialise();

//abc.create_user("mayank", "pass123", "Mayank Mathur");
if (abc.login("mayank", "pass123") == true) console.log("LOGIN SUCCESS!"); else console.log("SAR DARD CONTD.");
//abc.newNote("mayank", "pass123", "hello mera nam mayank hai.", "xyz", "CURTIME()");

abc.end_connection();
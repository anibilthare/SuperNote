var abc = require("./database");

abc.set_connection("localhost", "root", "root");
abc.initialise();
//abc.create_user("mayank", "pass123", "Mayank Mathur");
abc.login("mayank", "pass123");
abc.newNote("mayank", "pass123", "hello mera nam mayank hai.", "xyz", "CURTIME()");
abc.end_connection();
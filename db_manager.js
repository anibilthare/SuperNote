var client = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/SuperNote";

client.connect(url, function(err, db) {
	if (err)
		throw err;
	var dbo = db.db("SuperNote");
	var obj = {
		id: "ipdipode",
		time: "7:24 pm",
		note: "sdvaskjfhajfnjasdnfkjsdnfjkdnfljdsngsbd"
	};
	dbo.collection("Notes").insertOne(obj, function(err, res) {
		if (err)
			throw err;
		console.log("1 doc inserted!");
		db.close();
	});
});
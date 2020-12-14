const mongoose = require("mongoose");
// mongodb database connection string. change it as per your needs. here "mydb" is the name of the database. You don't need to create DB from mongodb terminal. mongoose create the db automatically.
mongoose.connect(
  "mongodb+srv://admin:x8asg6qGiSe2zTU5@database.rqd6l.mongodb.net/database",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("MongoDB Connected...");
});

module.exports = db;

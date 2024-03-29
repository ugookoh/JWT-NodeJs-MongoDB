const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = require('./app/routes');
const databaseConfiguration = require('./app/config/database.config');
var corsOptions = { origin: "http://localhost:8081" };

app.use(cors(corsOptions));
app.use(bodyParser.json()); //to parse requests of content type - application/json
app.use(bodyParser.urlencoded({ extended: true })); //parse requests of content-type - application/x-www-form-urlencoded

const database = require("./app/models");
const Role = database.role;

function initial() {
  //This is an initial function to create the 3 types of Roles as database schemas 
  Role.estimatedDocumentCount((err, count) => {//this gets the count
    if (!err && count === 0) {
      new Role({ name: "user" }).save(err => {
        if (err) { console.log("error", err) }
        console.log("Added 'user' to roles collection");
      });
      new Role({ name: "moderator" }).save(err => {
        if (err) { console.log("error", err) }
        console.log("Added 'moderator' to roles collection");
      });
      new Role({ name: "admin" }).save(err => {
        if (err) { console.log("error", err) }
        console.log("Added 'admin' to roles collection");
      });
    }
  });
}

database.mongoose.connect(
  `mongodb+srv://${databaseConfiguration.USER}:${databaseConfiguration.PASSWORD}@cluster0.x7cta.mongodb.net/${databaseConfiguration.NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected to the MongoDB database!");
  initial();
}).catch(err => {
  console.error("Connection error", err);
  process.exit();
});
app.use('/', routes);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" })
  next();
});
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to ugos server." });
// });

// Port that listens for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
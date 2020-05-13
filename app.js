const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("./config");
const users = require("./users");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Mongodb connection with mongoose
mongoose.connect(config.uri, { useNewUrlParser: true });
mongoose.connection.on("error", function (err) {
  console.log(err);
  process.exit(-1);
});
//Verify the auth tocken
app.use(function (req, res, next) {
  const token = req.headers["authorization"];
  let urlExclude = ["/"];
  if (token) {
    jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(400).send("Failed to authenticate token.");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    if (
      urlExclude.includes(req.path) &&
      (req.method === "PUT" || req.method === "POST")
    ) {
      next();
    } else {
      return res.status(400).send("Failed to authenticate token.");
    }
  }
});

// Routers iniziale
app.use("/", users);

app.listen(config.port, () =>
  console.log(`App listening at http://localhost:${config.port}`)
);

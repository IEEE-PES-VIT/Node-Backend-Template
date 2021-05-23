require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

const auth = require("./routes/auth");
const passport = require("passport");
const passportConfig = require("./routes/passport");
const morgan = require("./logger/morgan");

mongoose.connect(
  `mongodb://localhost/node_template`,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("Connected to database");
  }
);

app.use("/user", auth);

app.use(morgan);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.listen(port, () => {
  console.log("Server started at http://localhost:5000/");
});

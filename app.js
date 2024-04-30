const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Routes = require("./api/routes/routes");
require('dotenv').config();


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});
// Set origin untuk siapa saja yang bisa mengakses API
app.use(cors({credentials:true, origin:['http://localhost:3000', 'http://example.com', 'https://example.net']}));

app.use(cookieParser());
app.use(express.json());
app.use(Routes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status =404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

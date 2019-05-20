const debug = require("debug")("debugger");
const Joi = require("joi"); //validator
Joi.objectId = require("joi-objectid")(Joi);

const express = require("express");
const app = express();

require("./startup/routes")(app, express);
require("./startup/db")();

const winston = require("winston"); //logger
winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);
process.on("unhandledRejection", e => {
  throw e;
});

const config = require("config");
if (!config.get("jwtPrivateKey")) {
  console.error("ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  debug(`listening ${port}`);
});

const debug = require("debug")("debugger");
const Joi = require("joi"); //validator
Joi.objectId = require("joi-objectid")(Joi);

const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app, express);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  debug(`listening ${port}`);
});

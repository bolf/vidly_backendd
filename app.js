const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

//const genres

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening ${port}`);
});

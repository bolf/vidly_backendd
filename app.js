const express = require("express");
const genres = require("./routes/genres");

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening ${port}`);
});

const express = require("express");
const genres = require("./routes/genres");
const mongoose = require("mongoose");
const debug = require("debug")("debugger");
/*
If you define indexes in your Mongoose schemas, you'll see the below deprecation warning.
DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes
instead.
By default, Mongoose 5.x calls the MongoDB driver's ensureIndex() function. The MongoDB driver deprecated this function in favor of createIndex(). Set the useCreateIndex global option to opt in to making Mongoose use createIndex() instead.
mongoose.set('useCreateIndex', true);
You can also configure useCreateIndex by passing it through the connection options.
mongoose.connect(uri, { useCreateIndex: true });
There are no intentional backwards breaking changes with the useCreateIndex option, so you should be able to turn this option on without any code changes. If you discover any issues, please open an issue on GitHub.
https://mongoosejs.com/docs/deprecations.html
*/
mongoose.set("useCreateIndex", true);
mongoose
  .connect("mongodb://localhost:27017/vidly", {
    useNewUrlParser: true
  })
  .then(() => {
    debug("connected to db");
  })
  .catch(err => {
    debug(err);
  });

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  debug(`listening ${port}`);
});

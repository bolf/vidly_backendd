const debug = require("debug")("debugger");
const winston = require("winston");
const mongoose = require("mongoose");
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
module.exports = function() {
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect("mongodb://localhost:27017/vidly", {
      useNewUrlParser: true
    })
    .then(() => {
      winston.info("connected to db");
      //debug("connected to db");
    });
  // .catch(err => { now all errors are handeled by winston
  //   debug(err);
  // });
};

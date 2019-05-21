const winston = require("winston"); //logger
module.exports = function() {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  process.on("unhandledRejection", e => {
    throw e;
  });
};

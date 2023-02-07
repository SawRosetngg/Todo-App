require("dotenv").config();
const { httpPort } = require("./src/configuration");
const logging = require("./src/common/logging");
const db = require("./src/database");
const app = require("./src/app")();

db.init();
/**Initiating server on given port */
app.listen(httpPort, () => {
  logging.info(`Listening on *:${httpPort}`);
});

/**Catch uncaught exception */
process.on("uncaughtException", (error) => {
  logging.error(`UNCAUGHT EXCEPTION ${error}`);
});

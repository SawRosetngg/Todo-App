require("dotenv").config();
const { httpPort } = require("./src/configuration");
const logging = require("./src/common/logging");
const db = require("./src/database");
// const repositories = require("./data/repositories")(db);
// const services = require("./domain")(repositories);
const app = require("./src/app")(db.getClient());

db.init();
app.listen(httpPort, () => {
  logging.info(`Listening on *:${httpPort}`);
});

process.on("uncaughtException", (error) => {
  logging.error(`UNCAUGHT EXCEPTION ${error}`);
});

const tasks = require("./tasks");
const projects = require("./projects");

function init(app, dbClient) {
  app.use("/api/v1/tasks", tasks.init(dbClient));
  app.use("/api/v1/projects", projects.init(dbClient));
}

module.exports.init = init;

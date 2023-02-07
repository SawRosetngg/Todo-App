const tasks = require("./tasks");
const projects = require("./projects");

function init(app) {
  app.use("/api/v1/tasks", tasks.init());
  app.use("/api/v1/projects", projects.init());
}

module.exports.init = init;

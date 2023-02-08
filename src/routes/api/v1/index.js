const tasks = require("./tasks");
const projects = require("./projects");
const separate = require("./separate");

function init(app) {
  app.use("/api/v1/tasks", tasks.init());
  app.use("/api/v1/projects", projects.init());
  app.use("/api/v1/aggregate", separate.init());
}

module.exports.init = init;

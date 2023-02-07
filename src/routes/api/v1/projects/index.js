/* eslint-disable no-undef */
/**API controller for hanlding projects */

const express = require("express");
const {
  successResponseWithData,
  ErrorResponse,
} = require("../../../../common/apiresponses");
const utils = require("../../../../common/utils/Utils");
const ProjectService = require("../../../../services/Projects.service");
const TaskService = require("../../../../services/Tasks.service");

const router = express.Router({ mergeParams: true });

function init() {
  // Add new project
  router.post("/", async (req, res) => {
    try {
      //Body Payload
      const data = {
        ...req.body,
        tasks: [],
        startAt: new Date(req.body.startAt),
        dueAt: new Date(req.body.dueAt),
      };
      ProjectService.createProject(data, (error, result) => {
        if (error) {
          return ErrorResponse(res, error);
        }
        return successResponseWithData(
          res,
          "Successfully created project",
          result.ops[0]
        );
      });
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  //Assign Tasks
  router.post("/:id/assign", async (req, res) => {
    try {
      //Check if task exists or don't
      const task = await TaskService.getTask(req.body.task);
      if (!task) {
        return ErrorResponse(res, "Task doesn't exists.");
      }
      //Check if project exists or don't
      const project = await ProjectService.getProject(req.params.id);
      if (!project) {
        return ErrorResponse(res, "Project doesn't exists.");
      }
      const data = {
        id: req.params.id,
      };
      // Pushing into the tasks if there is not task assigned in the project
      if (!project.tasks || project.tasks.length == 0) {
        data.tasks = [req.body.task];
      } else {
        // Stopping duplication of task
        data.tasks = project.tasks.filter((t) => t != req.body.task);
        data.tasks = [...data.tasks, req.body.task];
      }
      ProjectService.addOrRemoveTasks(data, (error, result) => {
        if (error) {
          console.log(error);
          return ErrorResponse(res, error);
        }
        return successResponseWithData(res, "Successfully assigned task", {
          ...project,
          tasks: data.tasks,
        });
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(res, error);
    }
  });

  // Remove Tasks
  router.post("/:id/remove", async (req, res) => {
    try {
      //Check if task exists or don't
      const task = await TaskService.getTask(req.body.task);
      if (!task) {
        return ErrorResponse(res, "Task doesn't exists.");
      }
      //Check if project exists or don't
      const project = await ProjectService.getProject(req.params.id);
      if (!project) {
        return ErrorResponse(res, "Project doesn't exists.");
      }
      // Removing the task from the project
      const data = {
        id: req.params.id,
        tasks: project.tasks.filter((t) => t != req.body.task),
      };

      ProjectService.addOrRemoveTasks(data, (error, result) => {
        if (error) {
          console.log(error);
          return ErrorResponse(res, error);
        }
        return successResponseWithData(res, "Successfully removed task", {
          ...project,
          tasks: data.tasks,
        });
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(res, error);
    }
  });

  // Get all projects
  router.get("/", async (req, res) => {
    try {
      const projects = await ProjectService.getProjects();
      return successResponseWithData(res, "Project lists", projects);
    } catch (error) {
      console.log(error);
      return ErrorResponse(res, error);
    }
  });

  // Modify project
  router.put("/:id", async (req, res) => {
    try {
      const project = await ProjectService.getProject(req.params.id);
      if (!project) {
        return ErrorResponse(res, "Project doesn't exists.");
      }
      const data = {
        ...req.body,
        startAt: req.body.startAt
          ? new Date(req.body.startAt)
          : project.startAt,
        dueAt: req.body.dueAt ? new Date(req.body.dueAt) : project.dueAt,
        modifiedAt: new Date(),
      };
      ProjectService.modifyProject(
        { id: req.params.id, data },
        (error, result) => {
          if (error) {
            return ErrorResponse(res, error);
          }
          return successResponseWithData(res, "Successfully updated project", {
            ...project,
            ...data,
          });
        }
      );
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Remove project
  router.delete("/:id", async (req, res) => {
    try {
      const project = await ProjectService.getProject(req.params.id);
      if (!project) {
        return ErrorResponse(res, "Project doesn't exists.");
      }
      const data = {
        removedAt: new Date(),
      };
      ProjectService.modifyProject(
        { id: req.params.id, data },
        (error, result) => {
          if (error) {
            return ErrorResponse(res, error);
          }
          return successResponseWithData(res, "Successfully removed project", {
            ...project,
            ...data,
          });
        }
      );
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Filter projects
  router.get("/filters", async (req, res) => {
    try {
      const { name, sortBy } = req.query;
      let keywords = {};
      let sortBys = { startAt: 1 };
      if (name) {
        keywords.name = new RegExp(
          "^.*" + utils.escapeRegExp(name) + ".*$",
          "i"
        );
      }
      if (sortBy == "dueAt") {
        sortBys = { dueAt: 1 };
      }
      const projects = await ProjectService.filterProjects(keywords, sortBys);
      return successResponseWithData(res, "Project list", projects);
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Get project
  router.get("/:id", async (req, res) => {
    try {
      const project = await ProjectService.getProject(req.params.id);
      if (!project) {
        return ErrorResponse(res, "Project doesn't exists.");
      }
      return successResponseWithData(res, "Project details", project);
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  return router;
}

module.exports.init = init;

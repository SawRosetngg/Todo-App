/* eslint-disable no-undef */
/**API controller for hanlding task events */

const express = require("express");
const {
  successResponseWithData,
  ErrorResponse,
} = require("../../../../common/apiresponses");
const utils = require("../../../../common/utils/Utils");
const TaskService = require("../../../../services/Tasks.service");

const router = express.Router({ mergeParams: true });

function init() {
  // Add new task
  router.post("/", async (req, res) => {
    try {
      //Body Payload
      const data = {
        ...req.body,
        status: "TODO", // [TODO, PROGRESS, DONE]
        startAt: new Date(req.body.startAt),
        doneAt: new Date(req.body.doneAt),
      };
      TaskService.addTask(data, (error, result) => {
        if (error) {
          return ErrorResponse(res, error);
        }
        return successResponseWithData(
          res,
          "Successfully added task",
          result.ops[0]
        );
      });
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Get all tasks
  router.get("/", async (req, res) => {
    try {
      const tasks = await TaskService.getTasks();
      return successResponseWithData(res, "Task list", tasks);
    } catch (error) {
      console.log(error);
      return ErrorResponse(res, error);
    }
  });

  // Modify task
  router.put("/:id", async (req, res) => {
    try {
      const task = await TaskService.getTask(req.params.id);
      if (!task) {
        return ErrorResponse(res, "Task doesn't exists.");
      }
      const data = {
        ...req.body,
        startAt: req.body.startAt ? new Date(req.body.startAt) : task.startAt,
        doneAt: req.body.doneAt ? new Date(req.body.doneAt) : task.doneAt,
        modifiedAt: new Date(),
      };
      TaskService.modifyTask({ id: req.params.id, data }, (error, result) => {
        if (error) {
          return ErrorResponse(res, error);
        }
        return successResponseWithData(res, "Successfully updated task", {
          ...task,
          ...data,
        });
      });
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Remove task
  router.delete("/:id", async (req, res) => {
    try {
      const task = await TaskService.getTask(req.params.id);
      if (!task) {
        return ErrorResponse(res, "Task doesn't exists.");
      }
      const data = {
        removedAt: new Date(),
      };
      TaskService.modifyTask({ id: req.params.id, data }, (error, result) => {
        if (error) {
          return ErrorResponse(res, error);
        }
        return successResponseWithData(res, "Successfully removed task", {
          ...task,
          ...data,
        });
      });
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Filter tasks
  router.get("/filters", async (req, res) => {
    try {
      const { name, status, sortBy } = req.query;
      let keywords = {};
      let sortBys = { startAt: 1 };
      if (name) {
        keywords.name = new RegExp(
          "^.*" + utils.escapeRegExp(name) + ".*$",
          "i"
        );
      }
      if (status) {
        keywords.status = new RegExp(
          "^.*" + utils.escapeRegExp(status) + ".*$",
          "i"
        );
      }
      switch (sortBy) {
        case "dueAt": {
          sortBys = { dueAt: 1 };
          break;
        }
        case "doneAt": {
          sortBys = { dueAt: 1 };
          break;
        }
      }
      const tasks = await TaskService.filterTasks(keywords, sortBys);
      return successResponseWithData(res, "Task list", tasks);
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Get task
  router.get("/:id", async (req, res) => {
    try {
      const task = await TaskService.getTask(req.params.id);
      if (!task) {
        return ErrorResponse(res, "Task doesn't exists.");
      }
      return successResponseWithData(res, "Task details", task);
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  return router;
}

module.exports.init = init;

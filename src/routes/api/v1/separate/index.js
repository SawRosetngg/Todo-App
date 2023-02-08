/* eslint-disable no-undef */
/**API controller for hanlding projects */

const express = require("express");
const {
  successResponseWithData,
  ErrorResponse,
} = require("../../../../common/apiresponses");
const SepareateService = require("../../../../services/Separeate.Service");

const router = express.Router({ mergeParams: true });

function init() {
  // Get projects with tasks which due date are today
  router.post("/projectwithtasks", async (req, res) => {
    try {
      SepareateService.getProjectsWithTasks((error, result) => {
        if (error) {
          return ErrorResponse(res, error);
        }
        return successResponseWithData(
          res,
          "Project listing with tasks",
          result
        );
      });
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  // Get projects with tasks which due date are today
  router.post("/taskwithprojects", async (req, res) => {
    try {
      SepareateService.getTasksWithProjects((error, result) => {
        if (error) {
          return ErrorResponse(res, error);
        }
        return successResponseWithData(
          res,
          "Task listing with projects",
          result
        );
      });
    } catch (error) {
      return ErrorResponse(res, error);
    }
  });

  return router;
}

module.exports.init = init;

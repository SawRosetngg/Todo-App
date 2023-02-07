const express = require("express");
const { successResponseWithData } = require("../../../../common/apiresponses");

const router = express.Router({ mergeParams: true });

function init(dbClient) {
  router.post("/", async (req, res) => {
    return successResponseWithData(res, "Successfully added tasks", {});
  });


  return router;
}

module.exports.init = init;

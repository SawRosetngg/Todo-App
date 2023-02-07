const express = require("express");
const { successResponseWithData } = require("../../../../common/apiresponses");

const router = express.Router({ mergeParams: true });

function init() {
  router.get("/", async (req, res) => {
    return successResponseWithData(res, "Fetching user data", {});
  });

  return router;
}

module.exports.init = init;

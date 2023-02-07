const errors = require("../../common/errors");

const createResponseError = (err) => ({
  status: 0,
  message: err.message,
});

/**Function for handling error to the client */
function errorHandler(err, req, res) {
  //eslint-disable-line
  if (errors.isCustomError(err)) {
    return res.status(err.status).send(createResponseError(err));
  }

  const internalError = new errors.InternalServerError(err.message);
  return res
    .status(internalError.status)
    .send(createResponseError(internalError));
}

module.exports = errorHandler;

const http = require("http");
const express = require("express");
const cors = require("cors");
const compress = require("compression")();
const bodyParser = require("body-parser");
const logger = require("morgan");
const helmet = require("helmet");
const path = require("path");

const apiV1Routers = require("./routes/api/v1");

const errorRoute = require("./routes/errors");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); //trust first proxy
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(compress);
app.use(logger("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Requested-With"
    ]
  })
);

module.exports = (dbClient) => {
  app.use(express.static(path.join(__dirname, "public")));

  apiV1Routers.init(app, dbClient);
  
  app.use((req, res, next) => {
    const error = new Error("Page Not found");
    error.status = 404;
    error.code = "NOT_FOUND";
    next(error);
  });
  app.use(errorRoute);

  const httpServer = http.createServer(app);
  return httpServer;
};

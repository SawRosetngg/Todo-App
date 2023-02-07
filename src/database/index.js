const { MongoClient } = require("mongodb");

const logging = require("../common/logging");
const { dbConnectionString } = require("../configuration");

const client = new MongoClient(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const init = async () => {
  try {
    await client.connect();
    logging.info("Establish MongoDB connection...");
  } catch (error) {
    console.log(error);
  }
};

const getClient = () => {
  return client;
};

module.exports.init = init;
module.exports.getClient = getClient;

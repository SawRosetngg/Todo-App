const ObjectId = require("mongodb").ObjectId;
const configuration = require("../configuration");
const dbClient = require("../database").getClient();

const TaskService = {
  /**Storing task into database */
  addTask: async (data, callback) => {
    try {
      const result = await dbClient
        .db(configuration.dbName)
        .collection("tasks")
        .insertOne(data);
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  /**Modifying existing tasks */
  modifyTask: async ({ id, data }, callback) => {
    try {
      const result = await dbClient
        .db(configuration.dbName)
        .collection("tasks")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...data } },
          { new: true }
        );
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  /**Get a task details */
  getTask: async (id) => {
    return await dbClient
      .db(configuration.dbName)
      .collection("tasks")
      .findOne({ _id: new ObjectId(id), removedAt: { $eq: null } });
  },

  /**Get all tasks which are not being removed */
  getTasks: async () => {
    return await dbClient
      .db(configuration.dbName)
      .collection("tasks")
      .find({ removedAt: { $eq: null } })
      .toArray();
  },

  /**Get tasks based on the keywords: name and task status
   * Sorting the tasks based on start, due and done date.
   */
  filterTasks: async (keywords, sortBy) => {
    return await dbClient
      .db(configuration.dbName)
      .collection("tasks")
      .find({ ...keywords, removedAt: { $eq: null } })
      .sort(sortBy)
      .toArray();
  },
};

module.exports = TaskService;

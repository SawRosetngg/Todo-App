const ObjectId = require("mongodb").ObjectId;
const configuration = require("../configuration");
const dbClient = require("../database").getClient();

const ProjectService = {
  /**Storing project into database */
  createProject: async (data, callback) => {
    try {
      const result = await dbClient
        .db(configuration.dbName)
        .collection("projects")
        .insertOne(data);
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  /**Assigning or removing task to or from the project */
  addOrRemoveTasks: async (data, callback) => {
    try {
      const result = await dbClient
        .db(configuration.dbName)
        .collection("projects")
        .updateOne(
          { _id: new ObjectId(data.id) },
          { $set: { tasks: data.tasks } },
          { new: true }
        );
      callback(null, result);
    } catch (error) {
      callback(error, null);
    }
  },

  /**Modifying existing projects */
  modifyProject: async ({ id, data }, callback) => {
    try {
      const result = await dbClient
        .db(configuration.dbName)
        .collection("projects")
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

  /**Get a project details */
  getProject: async (id) => {
    return await dbClient
      .db(configuration.dbName)
      .collection("projects")
      .findOne({ _id: new ObjectId(id), removedAt: { $eq: null } });
  },

  /**Get all projects which are not being removed */
  getProjects: async () => {
    return await dbClient
      .db(configuration.dbName)
      .collection("projects")
      .find({ removedAt: { $eq: null } })
      .toArray();
  },

  /**Get projects based on the keywords: name
   * Sorting the projects based on start and due date.
   */
  filterProjects: async (keywords, sortBy) => {
    return await dbClient
      .db(configuration.dbName)
      .collection("projects")
      .find({ ...keywords, removedAt: { $eq: null } })
      .sort(sortBy)
      .toArray();
  },
};

module.exports = ProjectService;

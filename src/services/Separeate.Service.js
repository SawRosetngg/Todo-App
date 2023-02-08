const configuration = require("../configuration");
const dbClient = require("../database").getClient();

const SepareateService = {
  /**Mogodb aggregation pipeline for getting all projects that have a task with a due date set to today  */
  getProjectsWithTasks: async (callback) => {
    try {
      const currentDate = new Date();

      const lastMidnight = new Date(currentDate.setHours(0, 0, 0, 0));
      const nextMidnight = new Date(currentDate.setHours(24, 0, 0, 0));
      const d = await dbClient
        .db(configuration.dbName)
        .collection("projects")
        .aggregate([
          {
            $unwind: "$tasks",
          },
          {
            $project: {
              _id: "$_id",
              name: "$name",
              description: "$description",
              startAt: "$startAt",
              dueAt: "$dueAt",
              task: "$tasks",
            },
          },
          {
            $lookup: {
              from: "tasks",
              let: {
                task: { $toObjectId: "$task" },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$task"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    status: 1,
                    startAt: 1,
                    dueAt: 1,
                  },
                },
              ],
              as: "task",
            },
          },
          { $unwind: "$task" },
          {
            $match: {
              $expr: {
                $and: [
                  { $lte: ["$task.dueAt", nextMidnight] },
                  {
                    $gte: ["$task.dueAt", lastMidnight],
                  },
                ],
              },
            },
          },
        ])
        .toArray();
      callback(null, d);
    } catch (error) {
      callback(error);
    }
  },

  /** Mogodb aggregation pipeline for getting all tasks that have a project with a due date set to today **/
  getTasksWithProjects: async (callback) => {
    try {
      const currentDate = new Date();

      const lastMidnight = new Date(currentDate.setHours(0, 0, 0, 0));
      const nextMidnight = new Date(currentDate.setHours(24, 0, 0, 0));
      const d = await dbClient
        .db(configuration.dbName)
        .collection("projects")
        .aggregate([
          {
            $unwind: "$tasks",
          },
          {
            $project: {
              _id: "$_id",
              name: "$name",
              description: "$description",
              startAt: "$startAt",
              dueAt: "$dueAt",
              task: "$tasks",
            },
          },
          {
            $lookup: {
              from: "tasks",
              let: {
                task: { $toObjectId: "$task" },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$task"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    status: 1,
                    startAt: 1,
                    dueAt: 1,
                  },
                },
              ],
              as: "task",
            },
          },
          { $unwind: "$task" },
          {
            $match: {
              $expr: {
                $and: [
                  { $lte: ["$dueAt", nextMidnight] },
                  {
                    $gte: ["$dueAt", lastMidnight],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: "$task._id",
              name: "$task.name",
              description: "$task.description",
              status: "$task.status",
              startAt: "$task.startAt",
              dueAt: "$task.dueAt",
              project: {
                _id: "$_id",
                name: "$name",
                description: "$description",
                startAt: "$startAt",
                dueAt: "$dueAt",
              },
            },
          },
        ])
        .toArray();
      callback(null, d);
    } catch (error) {
      console.log(error);
      callback(error);
    }
  },
};

module.exports = SepareateService;

/**Configuration file for whole projects */
module.exports = {
  dbConnectionString: process.env.DATABASE_URL,
  dbName: process.env.DATABASE_NAME,
  httpPort: process.env.HTTP_PORT || 8080,
};

const { MongoMemoryServer } = require("mongodb-memory-server");

const start = async () => {
  const mongod = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1",
      port: 27017,
      dbName: "assignmentdb",
    },
    binary: {
      version: "6.0.14",
    },
  });

  console.log("Temporary MongoDB started");
  console.log(mongod.getUri());
  console.log("Keep this terminal open while testing");
};

start().catch((error) => {
  console.error("Could not start temporary MongoDB");
  console.error(error);
  process.exit(1);
});

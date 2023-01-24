const connectMongodbSession = require("connect-mongodb-session");

const getSessionStore = (session) => {
  const MongoDBSession = connectMongodbSession(session);
  const store = new MongoDBSession({
    uri: process.env.MONGODB_URI,
    collection: "auth-session",
  });

  return store;
};

module.exports = getSessionStore;

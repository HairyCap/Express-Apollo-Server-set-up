const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const schema = require("./schema/schema");

const app = express();
const server = new ApolloServer(schema);
server.applyMiddleware({ app });

mongoose.connect(
  "mongodb://connection srting",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("connected to DB");
});

const PORT = process.env.post || 4002;
app.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
});

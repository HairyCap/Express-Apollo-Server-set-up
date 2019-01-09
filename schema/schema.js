const { gql, PubSub, withFilter } = require("apollo-server-express");
const { NEW_MSG } = require("./pubSubTags");
const pubsub = new PubSub();
const typeDefs = gql`
  type Query {
    hello: String
  }

  type MsgType {
    id: String
    content: String
  }

  type Mutation {
    addMsg(content: String!): MsgType
  }

  type Subscription {
    newMsg(content: String): MsgType
  }
`;

const resolvers = {
  Subscription: {
    newMsg: {
      subscribe: withFilter(
        //() => pubsub.asyncIterator([EventTag]),
        () => pubsub.asyncIterator([NEW_MSG]),
        //fliter function
        (payload, args) => {
          return !args.content || payload.Msg.includes(args.content);
        }
      ),
      resolve: payload => ({
        msg: payload.Msg
      })
    }
  },
  Query: {
    hello: () => {
      return "Hello world!";
    }
  },
  Mutation: {
    addMsg: (_, args) => {
      //pubsub.publish(EventTag, payoad);
      pubsub.publish(NEW_MSG, { Msg: args.content });
    }
  }
};

module.exports = { typeDefs, resolvers };

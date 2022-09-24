import {
  ApolloServerExpressConfig,
  AuthenticationError,
} from "apollo-server-express";
import express from "express";
import Express from "express";
import { DataSource } from "typeorm";
import { db, dbConfig } from "./database/db";
import { Category } from "./database/entity/Category";
import { SubCategory } from "./database/entity/SubCategory";
import { User } from "./database/entity/User";
import { config } from "./config";
import { OAuth2Client } from "google-auth-library";
import { checkAuth } from "./helpers/checkAuth";
const jwt = require("jsonwebtoken");
const { ApolloServer, gql } = require("apollo-server-express");
const client = new OAuth2Client(config.CLIENT_ID);

const typeDefs = gql`
  type SubCategory {
    id: Int
    name: String
    urlName: String
  }

  type Category {
    id: Int
    name: String
    urlName: String
    subcategory: [SubCategory]
  }

  type Query {
    categories: [Category]
  }

  type Mutation {
    addUser(credential: String): String
  }
`;

const resolvers = {
  Query: {
    categories: async (
      parent: undefined,
      args: undefined,
      context: { user: String }
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Session expired. Please login again.", {
          status: 401,
        });
      }
      const categories = await db
        .getRepository(Category)
        .find()
        .catch((err) => console.log(err));
      console.log(categories);
      return categories;
    },
  },
  Mutation: {
    addUser: async (
      parent: undefined,
      { credential }: { credential: string }
    ) => {
      const info = await client.verifyIdToken({
        idToken: credential,
        audience: config.CLIENT_ID,
      });

      const generateToken = (user: { id: Number; email: String }) => {
        const token = jwt.sign(
          { email: user.email, userId: user.id },
          config.JWT_KEY,
          {
            expiresIn: "12h",
          }
        );
        return token;
      };
      const user = await db
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email: info.getPayload().email })
        .getOne();

      if (user) {
        return generateToken(user);
      } else {
        const insert = await db
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({ email: info.getPayload().email })
          .execute();

        const token = generateToken({
          id: insert.identifiers[0].id,
          email: info.getPayload().email,
        });
        return token;
      }
    },
  },
};

const startServer = async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Express.Request }) => {
      const authHeader = req.headers.authorization || "";
      const user = checkAuth(authHeader);
      return { user };
    },
  });
  await server.start();

  await db.initialize();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();

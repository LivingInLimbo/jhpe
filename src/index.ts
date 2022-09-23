/*var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
import Express from "express";
import { db } from "./database/db";
import { User } from "./database/entity/User";
import { config } from "./config";
import { OAuth2Client } from "google-auth-library";
import { categories } from "./helpers/categories";
import { subcategories } from "./helpers/subcategories";
import { Category } from "./database/entity/Category";
import { SubCategory } from "./database/entity/SubCategory";
import { checkAuth } from "./helpers/checkAuth";

const client = new OAuth2Client(config.CLIENT_ID);

var app = express();
const PORT = 3001;

app.use(cors());

var nonAuthTypes = `
type Category {
  id: Int
  name: String
  urlName: String
}`;

var nonAuthQueries = `
getCategories: [Category]
`;

var nonAuthMutations = `
addUser(credential: String): String
`;

var nonAuthSchemaString = `

  ${nonAuthTypes}

  type Query {
    ${nonAuthQueries}
  }

  type Mutation {
    ${nonAuthMutations}
  }
`;

var nonAuthSchema = buildSchema(nonAuthSchemaString);

// The root provides a resolver function for each API endpoint
var nonAuthRoot = {
  addUser: async ({ credential }: { credential: string }) => {
    const info = await client.verifyIdToken({
      idToken: credential,
      audience: config.CLIENT_ID,
    });

    const generateToken = (user: User) => {
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
  getCategories: async () => {
    const categories = await db.getRepository(Category).find();
    console.log(categories);
    return categories;
  },
};

var authQueries = `

`;

var authMutations = `

`;

var authSchemaString = `

type Query {
  testQuery: String
}


`;

// Construct a schema, using GraphQL schema language
var authSchema = buildSchema(authSchemaString);

// The root provides a resolver function for each API endpoint
var authRoot = {
  testQuery: ({ token }: { token: String }) => {
    return "lmfao";
  },
};

app.use(express.static(path.resolve(__dirname, "../client/build")));

// All other GET requests not handled before will return our React app
app.get("*", (req: Express.Request, res: Express.Response) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

db.initialize().then(async () => {
  const manager = db.manager;
  const count = await manager.count(Category);
  if (count == 0) {
    categories.forEach(async (category) => {
      const subcategories = category.subcategories;
      const newCategory = manager.create(Category, {
        name: category.name,
        urlName: category.urlName,
      });
      const insertedCategory = await manager.save(newCategory);
      const id = insertedCategory.id;
      const entities = subcategories.map((subcategory) =>
        manager.create(SubCategory, {
          ...subcategory,
          category: insertedCategory,
        })
      );
      await manager.save(entities);
    });
  }

  app.use(
    "/authGql",
    checkAuth,
    graphqlHTTP((req: Express.Request) => ({
      schema: authSchema,
      rootValue: authRoot,
      graphiql: true,
      context: req.ReqBody
    }))
  );

  app.use(
    "/noAuthGql",
    graphqlHTTP({
      schema: nonAuthSchema,
      rootValue: nonAuthRoot,
      graphiql: true,
    })
  );

  app.listen(PORT);
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});
*/

const { ApolloServer, gql } = require("apollo-server-express");
import {
  ApolloServerExpressConfig,
  AuthenticationError,
} from "apollo-server-express";
import express from "express";
import Express from "express";
import { DataSource } from "typeorm";
import { db, dbConfig } from "./database/db";
import { Category } from "./database/entity/Category";
import { User } from "./database/entity/User";
import { config } from "./config";
const jwt = require("jsonwebtoken");
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(config.CLIENT_ID);

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Category {
    id: Int
    name: String
    urlName: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    getCategories: [Category]
  }

  type Mutation {
    addUser(credential: String): String
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getCategories: async (
      parent: undefined,
      args: undefined,
      context: { user: String }
    ) => {
      if (context.user) {
        throw new AuthenticationError("gtfo KIDDO", { status: 401 });
      }
      const categories = await db.getRepository(Category).find();
      console.log(categories);
      return categories;
    },
    books: () => books,
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

      const generateToken = (user: User) => {
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

export const checkAuth = (authHeader: String) => {
  let userData;
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], config.JWT_KEY);
    userData = decoded;
  } catch (error) {
    console.log(error);
  }
  return userData;
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

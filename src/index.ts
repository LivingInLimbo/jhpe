var express = require("express");
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
${nonAuthQueries}

`;

var authMutations = `
${nonAuthMutations}
`;

var authSchemaString = `

${nonAuthTypes}

type Query {
  ${authQueries}
}
`;

// Construct a schema, using GraphQL schema language
var authSchema = buildSchema(authSchemaString);

// The root provides a resolver function for each API endpoint
var authRoot = {
  ...nonAuthRoot,
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
    graphqlHTTP({
      schema: authSchema,
      rootValue: authRoot,
      graphiql: true,
    })
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

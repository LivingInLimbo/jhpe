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

const client = new OAuth2Client(config.CLIENT_ID);

var app = express();
const PORT = 3001;

app.use(cors());

// Construct a schema, using GraphQL schema language
var authSchema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }

  type Mutation {
    addUser: String
  }
`);

// The root provides a resolver function for each API endpoint
var authRoot = {
  rollDice: ({ numDice, numSides }: { numDice: number; numSides: number }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  addUser: async () => {
    /*const res = await db
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { firstName: "Timber", lastName: "Saw", isGold: false },
        { firstName: "Phantom", lastName: "Lancer", isGold: false },
      ])
      .execute();
    console.log(res);*/
    return "lmfao";
  },
};

var nonAuthSchema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }

  type Mutation {
    addUser(credential: String): String
  }
`);

// The root provides a resolver function for each API endpoint
var nonAuthRoot = {
  rollDice: ({ numDice, numSides }: { numDice: number; numSides?: number }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
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
};

app.use(express.static(path.resolve(__dirname, "../my-app/build")));

// All other GET requests not handled before will return our React app
app.get("*", (req: Express.Request, res: Express.Response) => {
  res.sendFile(path.resolve(__dirname, "../my-app/build", "index.html"));
});

const susMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  console.log("very sus middleware");
  next();
};

db.initialize().then(async () => {
  app.use(
    "/authGql",
    susMiddleware,
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

import {
  ApolloServerExpressConfig,
  AuthenticationError,
} from "apollo-server-express";
import express, { query } from "express";
import Express from "express";
import { DataSource, ILike, Not, Raw } from "typeorm";
import { db, dbConfig } from "./database/db";
import { Category } from "./database/entity/Category";
import { SubCategory } from "./database/entity/SubCategory";
import { User } from "./database/entity/User";
import { Listing } from "./database/entity/Listing";
import { config } from "./config";
import { OAuth2Client } from "google-auth-library";
import { checkAuth, checkAuthMiddleware } from "./helpers/checkAuth";
import { ListingImage } from "./database/entity/ListingImage";
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { ApolloServer, gql } = require("apollo-server-express");
const client = new OAuth2Client(config.CLIENT_ID);
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./uploads");
  },
  filename: function (req: any, file: any, cb: any) {
    console.log(file);
    if (file.mimetype == "image/webp") {
      cb(null, uuidv4() + ".webp");
    } else {
      cb(null, uuidv4() + ".png");
    }
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  //reject a file
  if (
    ["image/jpg", "image/jpeg", "image/png", "image/webp"].find(
      (value) => value == file.mimetype
    ) != undefined
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 25, fieldSize: 1024 * 1024 * 15 },
  fileFilter: fileFilter,
});

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

  type User {
    id: Int
    phone: String
    email: String
    firstName: String
    lastName: String
    isGold: Boolean
  }

  type Listing {
    id: Int
    title: String
    description: String
    price: Int
    images: [ListingImage]
    category: Category
    subcategory: SubCategory
    user: User
  }

  type ListingImage {
    name: String
  }

  type Query {
    categories: [Category]
    getListings(
      category: String
      search: String
      gold: Boolean
      offset: Int
      sort: String
    ): [Listing]
    getListingCount(category: String, search: String, gold: Boolean): Int
  }

  type AddUserReturn {
    token: String
    isGold: Boolean
  }

  type Mutation {
    addUser(credential: String): AddUserReturn
  }
`;

type UserType = {
  id: Number;
  email: String;
  isGold: Boolean;
};

const resolvers = {
  Query: {
    categories: async (
      parent: undefined,
      args: undefined,
      context: { user: UserType }
    ) => {
      /*if (!context.user) {
        throw new AuthenticationError("Session expired. Please login again.", {
          status: 401,
        });
      }*/
      const categories = await db
        .getRepository(Category)
        .find()
        .catch((err) => console.log(err));
      console.log(categories);
      return categories;
    },
    getListings: async (
      parent: undefined,
      {
        category,
        search,
        gold,
        offset,
        sort,
      }: {
        category: String;
        search: String;
        gold: Boolean;
        offset: number;
        sort: String;
      }
    ) => {
      sort = sort || "";
      let orderBy = sort.split("-")[0];
      let dir = sort.split("-")[1] || "desc";
      if (orderBy == "price") {
        orderBy = "Listing.price";
      } else {
        orderBy = "Listing.last_update";
      }

      if (["desc", "asc"].findIndex((d: string) => d == dir) < 0) {
        dir = "desc";
      }

      const listings = await db
        .getRepository(Listing)
        .createQueryBuilder("listing")
        .leftJoinAndSelect("listing.category", "category")
        .leftJoinAndSelect("listing.subcategory", "subcategory")
        .leftJoinAndSelect("listing.images", "images")
        .where(
          `(Listing.title ilike '%' || :search || '%' or Listing.description ilike '%' || :search || '%')`,
          { search }
        )
        .andWhere(
          "(:category::varchar is null or category.urlName = :category or subcategory.urlName = :category)",
          {
            category: category || null, // explicitly pass null as the empty string isn't considered null (unlike raw PostgreSQL)
          }
        )
        .orderBy(`${orderBy}`, dir == "asc" ? "ASC" : "DESC")
        .getMany();

      return listings;
    },
    getListingCount: async (
      parent: undefined,
      {
        category,
        search,
        gold,
      }: { category: String; search: String; gold: Boolean }
    ) => {
      const listings = await db
        .getRepository(Listing)
        .createQueryBuilder("listing")
        .leftJoinAndSelect("listing.category", "category")
        .leftJoinAndSelect("listing.subcategory", "subcategory")
        .leftJoinAndSelect("listing.images", "images")
        .where(
          `Listing.title ilike '%' || :search || '%' or Listing.description ilike '%' || :search || '%'`,
          { search }
        )
        .andWhere(
          ":category::varchar is null or category.urlName = :category or subcategory.urlName = :category",
          {
            category: category || null, // explicitly pass null as the empty string isn't considered null (unlike raw PostgreSQL)
          }
        )
        .getCount();

      return listings;
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

      const generateToken = (user: {
        id: Number;
        email: String;
        isGold: Boolean;
      }) => {
        const token = jwt.sign(
          { email: user.email, userId: user.id, gold: user.isGold },
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
        return { token: generateToken(user), isGold: user.isGold };
      } else {
        const insert = await db
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({ email: info.getPayload().email })
          .execute();

        const token = generateToken({
          id: user.id,
          email: user.email,
          isGold: user.isGold,
        });
        return { token: token, isGold: user.isGold };
      }
    },
  },
};

const startServer = async () => {
  const app = express();

  app.post(
    "/createListing",
    checkAuthMiddleware,
    upload.array("images[]", 10),
    async (req: any, res: Express.Response) => {
      const title = req.body.title || "";
      const price = parseInt(req.body.price) || 0;
      const description = req.body.description || "";
      const isGold = (req.body.isGold || "false") == "true";
      const category = parseInt(req.body.categoryId);
      const userId = req.user.userId;
      if (!category) {
        res.status(400).json("no category");
      }
      const subcategory = parseInt(req.body.subCategoryId);
      if (!subcategory) {
        res.status(400).json("no subcategory");
      }
      const queryBuilder = db.createQueryBuilder();
      const listing = db
        .getRepository(Listing)
        .create({ title, price, description, isGold });
      await db.getRepository(Listing).save(listing);
      await queryBuilder
        .relation(Listing, "category")
        .of(listing.id)
        .set(category);
      await queryBuilder
        .relation(Listing, "subcategory")
        .of(listing.id)
        .set(subcategory);
      await queryBuilder.relation(Listing, "user").of(listing.id).set(userId);
      const listingImages = req.files.map((file: any) =>
        db.getRepository(ListingImage).create({ name: file.filename })
      );
      await db.getRepository(ListingImage).save(listingImages);
      await queryBuilder
        .relation(Listing, "images")
        .of(listing.id)
        .add(listingImages);
    }
  );

  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.use("/uploads", express.static("uploads"));

  // All other GET requests not handled before will return our React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
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

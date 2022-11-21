import {
  ApolloServerExpressConfig,
  AuthenticationError,
} from "apollo-server-express";
import express, { query } from "express";
import Express from "express";
import { DataSource, ILike, Not, Raw, IsNull } from "typeorm";
import { db, dbConfig } from "./database/db";
import { Category } from "./database/entity/Category";
import { SubCategory } from "./database/entity/SubCategory";
import { User } from "./database/entity/User";
import { Listing } from "./database/entity/Listing";
import { config } from "./config";
import { OAuth2Client } from "google-auth-library";
import { checkAuth, checkAuthMiddleware } from "./helpers/checkAuth";
import { ListingImage } from "./database/entity/ListingImage";
const fs = require("fs");
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
    id: Int!
    phone: String
    email: String!
    firstName: String
    lastName: String
    isGold: Boolean
  }

  type Listing {
    id: Int
    isGold: Boolean
    title: String
    description: String
    price: Int
    images: [ListingImage]
    category: Category
    subcategory: SubCategory
    user: User
  }

  type ListingImage {
    id: Int
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
    getListing(id: Int): Listing
    getUserListing(id: Int): Listing
    checkUserOwnsListing(id: Int): Boolean
    getListingCount(category: String, search: String, gold: Boolean): Int
    getListingsByUser: [Listing]
    checkToken: Boolean
    getUser: User
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
  id: number;
  email: string;
  isGold: boolean;
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

      console.log(offset || 1);

      const listings = await db
        .getRepository(Listing)
        .createQueryBuilder("Listing")
        .leftJoinAndSelect("Listing.category", "category")
        .leftJoinAndSelect("Listing.subcategory", "subcategory")
        .leftJoinAndSelect("Listing.images", "images")
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
        .skip(offset || 0)
        .take(1)
        .getMany()
        .catch((e) => console.log(e));

      //const listingsSql = listings.getSql();
      console.log(listings);

      return listings;
    },
    getListing: async (
      parent: undefined,
      { id }: { id: number },
      context: { user: UserType }
    ) => {
      const listing = await db.getRepository(Listing).findOne({
        where: { id: id },
      });
      return listing;
    },
    getUserListing: async (
      parent: undefined,
      { id }: { id: number },
      context: { user: UserType }
    ) => {
      if (!context.user) {
        return new AuthenticationError("Token expired");
      }
      const listing = await db.getRepository(Listing).findOne({
        where: { id: id, user: { id: context.user.id } },
      });
      return listing;
    },
    checkUserOwnsListing: async (
      parent: undefined,
      { id }: { id: number },
      context: { user: UserType }
    ) => {
      console.log(context.user);
      if (!context.user) {
        return false;
      } else {
        let listing = await db
          .getRepository(Listing)
          .findOne({ where: { id: id } });
        console.log(listing.user.id, context.user.id);
        if (context.user.id == listing.user.id) {
          return true;
        } else {
          return false;
        }
      }
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
    getListingsByUser: async (
      parent: undefined,
      args: undefined,
      context: { user: UserType }
    ) => {
      if (!context.user) {
        return new AuthenticationError("Token expired");
      } else {
        const listings = db
          .getRepository(Listing)
          .find({ where: { user: { id: context.user.id } } });
        return listings;
      }
    },
    checkToken: async (
      parent: undefined,
      args: undefined,
      context: { user: UserType }
    ) => {
      if (!context.user) {
        return new AuthenticationError("Token expired");
      } else return true;
    },
    getUser: async (
      parent: undefined,
      args: undefined,
      context: { user: UserType }
    ) => {
      if (!context.user) {
        return new AuthenticationError("Token expired");
      } else {
        const user = await db
          .getRepository(User)
          .findOne({ where: { id: context.user.id } });
        return user;
      }
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
          { email: user.email, id: user.id, gold: user.isGold },
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
      res.status(200).json({ message: "success" });
    }
  );

  app.post(
    "/editListing",
    checkAuthMiddleware,
    upload.array("images[]", 10),
    async (req: any, res: Express.Response) => {
      const title = req.body.title || "";
      const price = parseInt(req.body.price) || 0;
      const description = req.body.description || "";
      const isGold = (req.body.isGold || "false") == "true";
      const category = parseInt(req.body.categoryId);
      const id = parseInt(req.body.id);
      const imageIds = req.body.imageIds || [];
      const userId = req.user.userId;

      if (!category) {
        res.status(400).json("no category");
      }
      const subcategory = parseInt(req.body.subCategoryId);
      if (!subcategory) {
        res.status(400).json("no subcategory");
      }
      const queryBuilder = db.createQueryBuilder();
      await db
        .getRepository(Listing)
        .update({ id: id }, { title, price, description, isGold });
      let listing = await db.getRepository(Listing).findOneBy({ id: id });
      await queryBuilder
        .relation(Listing, "category")
        .of(listing.id)
        .set(category);
      await queryBuilder
        .relation(Listing, "subcategory")
        .of(listing.id)
        .set(subcategory);
      listing.images.forEach(async (image: ListingImage) => {
        let idx = imageIds.findIndex((id: string) => parseInt(id) == image.id);
        if (idx < 0) {
          fs.unlink(`./uploads/${image.name}`, async (err: any) => {
            if (err) {
              console.log(err);
            }
            await queryBuilder
              .relation(Listing, "images")
              .of(listing.id)
              .remove(image.id);
          });
        }
      });
      const listingImages = req.files.map((file: any) =>
        db.getRepository(ListingImage).create({ name: file.filename })
      );
      await db.getRepository(ListingImage).save(listingImages);
      await queryBuilder
        .relation(Listing, "images")
        .of(listing.id)
        .add(listingImages);
      res.status(200).json({ message: "success" });
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

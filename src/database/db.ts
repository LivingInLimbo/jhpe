import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Category } from "./entity/Category";
import { SubCategory } from "./entity/SubCategory";
import { Listing } from "./entity/Listing";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ListingImage } from "./entity/ListingImage";

export const dbConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "shaunlyne",
  password: "test",
  database: "jhpe",
  synchronize: true,
  logging: false,
  entities: [User, Category, SubCategory, Listing, ListingImage],
};

export const db = new DataSource(dbConfig);

import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Category } from "./entity/Category";
import { SubCategory } from "./entity/SubCategory";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const dbConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "shaunlyne",
  password: "test",
  database: "jhpe",
  synchronize: true,
  logging: false,
  entities: [User, Category, SubCategory],
};

export const db = new DataSource(dbConfig);

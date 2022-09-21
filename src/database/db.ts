import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Category } from "./entity/Category";
import { SubCategory } from "./entity/SubCategory";

export const db = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "shaunlyne",
  password: "test",
  database: "jhpe",
  synchronize: true,
  logging: false,
  entities: [User, Category, SubCategory],
  migrations: ["dist/database/**/migration/*.js"],
});

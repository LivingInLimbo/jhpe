import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const db = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "shaunlyne",
  password: "test",
  database: "jhpe",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ["dist/database/**/migration/*.js"],
});

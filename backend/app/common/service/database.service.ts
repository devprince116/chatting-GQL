import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;


//  create a function to initialize the database connection;
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "1234",
  database: "chatting",
  port: 5432,
  synchronize: true,
  // migrationsRun: true,
  entities: ["app/common/entity/*.ts"],
  migrations: ["app/migrations/*.ts"],
});

export const initDb = async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log("DB Connected ");
    })
    .catch((err) => {
      console.log("DB Connection failed: ", err);
    });
};

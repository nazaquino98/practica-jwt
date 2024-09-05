import { createConnection } from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "../config/env.js";

const newConnection = async () => {
  const connection = await createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  return connection;
};

export { newConnection };

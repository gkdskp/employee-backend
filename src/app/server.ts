import "./config"; // initiate dot env configs, etc.

import { createConnection } from "typeorm";
import App from "./app";
import controllers from "./controller";
import config from "./config/rdbms";

process.on("uncaughtException", (e) => {
  process.exit(1);
});
process.on("unhandledRejection", (e) => {
  process.exit(1);
});

(async () => {
  try {
    await createConnection(config);
  } catch(_) {
    console.log(_);
  }

  const app = new App(controllers);
  app.listen();
})();

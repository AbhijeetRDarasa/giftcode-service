const express = require("express");
require("./src/library/mongo").connect();
require("dotenv").config();
const app = express();

const route = require("./src/routes");

app.use(express.json());

route.routes(app);

app.listen(process.env.APP_PORT, async () =>
  console.log(`Debet gateway listening on port ${process.env.APP_PORT}!`)
);

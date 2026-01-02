import express, { Express } from "express";
import cors from "cors";

const app: Express = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

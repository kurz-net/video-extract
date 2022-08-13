import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/server";

const app = express();
dotenv.config();

app.use(
  cors({ origin: [process.env.ALLOW_ORIGIN || "http://localhost:3000"] })
);

app.use(express.static("videos"))

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
});

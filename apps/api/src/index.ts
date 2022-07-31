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

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(process.env.PORT || 5000);

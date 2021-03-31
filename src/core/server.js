import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { router } from "./router";
import { errorHandler } from "./errorHandler";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(router);
app.use(errorHandler);

export const start = port => new Promise(resolve => app.listen(port, () => resolve(app)));

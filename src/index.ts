import express, { NextFunction } from "express";
import { uploadVideo } from "./controllers/uploadController";
import { errorHandler } from "./utils/errorHandler";
import { downloadVideo } from "./controllers/videoController";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    legacyHeaders: false,
  })
);
// app.use(
//   fileUpload({
//     limits: { fileSize: 2 * 1024 * 1024 * 1024 },
//     abortOnLimit: true,
//     responseOnLimit: "File size exceeds the limit of 2 GB.",
//   })
// );

app.post("/upload", uploadVideo);
app.get("/download/:filename", downloadVideo);

app.use(errorHandler);

export default app;

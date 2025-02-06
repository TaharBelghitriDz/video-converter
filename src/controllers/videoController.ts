import { Request, Response } from "express";
import { getConvertedFilePath } from "../services/fileServices";
import { errorHandler } from "../utils/errorHandler";

export const downloadVideo = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    if (!filename || typeof filename !== "string")
      throw new Error("Invalid filename provided.");

    const filePath = await getConvertedFilePath(filename);

    res.setHeader("Content-Type", "video/mp4");
    res.download(filePath, filename, (err) => {
      if (err) throw new Error("Failed to download the file.");
    });
  } catch (error) {
    if (error instanceof Error) errorHandler(error, req, res);
    else errorHandler(new Error("An unknown error occurred."), req, res);
  }
};

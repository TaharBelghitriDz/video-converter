import { Request, Response } from "express";
import { processUpload } from "../services/fileServices";
import { convertVideo } from "../services/videoService";
import { errorHandler } from "../utils/errorHandler";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { filePath, fileName } = await processUpload(req);
    const savedVideo = await convertVideo(filePath, fileName);

    res.status(200).json({
      message: "Video converted successfully!",
      downloadLink: `/download/${savedVideo}`,
    });
  } catch (error) {
    if (error instanceof Error) errorHandler(error, req, res);
    else errorHandler(new Error("An unknown error occurred."), req, res);
  }
};

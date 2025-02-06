import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

const CONVERTED_DIR = path.join(__dirname, "../../converted");

export const convertVideo = (
  inputPath: string,
  fileName: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.mkdirSync(CONVERTED_DIR, { recursive: true });
      const outputFileName = fileName.replace(".mov", ".mp4");
      const outputPath = path.join(CONVERTED_DIR, outputFileName);

      ffmpeg(inputPath)
        .output(outputPath)
        .on("end", () => resolve(outputFileName))
        .on("error", (err) => reject(err))
        .run();
    } catch (error) {
      reject(error);
    }
  });
};

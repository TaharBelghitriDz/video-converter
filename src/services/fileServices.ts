import multiparty from "multiparty";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const CONVERTED_DIR = path.join(__dirname, "../../converted");

export const processUpload = (
  req: any
): Promise<{ filePath: string; fileName: string }> => {
  return new Promise((resolve, reject) => {
    if (
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    )
      return reject(
        new Error("Only multipart/form-data requests are allowed!")
      );

    const form = new multiparty.Form({
      maxFilesSize: 2 * 1000 * 1000 * 1000,
      maxFields: 1,
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) return reject(err);

      if (!files.video || files.video.length !== 1)
        return reject(
          new Error(
            'Please upload exactly one video file under the "video" field.'
          )
        );

      const file = files.video[0];
      const fileType = mime.lookup(file.path);

      if (!fileType || !fileType.includes("video"))
        return reject(new Error("The uploaded file is not a valid video."));

      if (path.extname(file.originalFilename).toLowerCase() !== ".mov")
        return reject(new Error("Only .mov files are allowed!"));

      try {
        if (!fs.existsSync(UPLOAD_DIR))
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });

        const fileName = `${Date.now()}_${file.originalFilename}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        fs.copyFileSync(file.path, filePath);

        fs.unlinkSync(file.path);

        resolve({ filePath, fileName });
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const getConvertedFilePath = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(CONVERTED_DIR, filename);
    if (!fs.existsSync(filePath)) return reject(new Error("File not found!"));

    resolve(filePath);
  });
};

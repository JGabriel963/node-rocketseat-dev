import multer from "multer";
import path from "node:path";
import { randomBytes } from "node:crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
// const UPLOADS_FOLDER = path.relative(TMP_FOLDER, "uploads");
const UPLOADS_FOLDER = path.resolve(__dirname, "..", "..", "tmp", "uploads");

// 1KB = 1024 Bytes
// 1MB = 1024 * 1024
// 3MB = 1024 * 1024 * 3
const MAX_SIZE = 3;
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE; // 3M
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  // limits: {
  //   fileSize: MAX_FILE_SIZE,
  // },
  // fileFilter(req, file, callback) {
  //   if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Invalid file type"));
  //   }
  // },
} satisfies multer.Options;

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MAX_SIZE,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  MULTER,
};

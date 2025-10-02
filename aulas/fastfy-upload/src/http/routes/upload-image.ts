import { FastifyInstance } from "fastify";
import fs from "fs";
import { writeFile, unlink, mkdir } from "fs/promises";
import { promisify } from "util";
import { pipeline } from "stream";
import { randomUUID } from "crypto";
import path from "path";
import { MultipartFile } from "@fastify/multipart";

const pump = promisify(pipeline);

export async function uploadImage(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const data = (await request.file()) as MultipartFile;

    const buffer = await data.toBuffer();

    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(data.filename);

    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        "Invalid image format. Only JPG, JPEG, and PNG are allowed."
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new Error("Image size exceeds 50MB limit.");
    }

    // Raiz do projeto //fatify-upload
    const imageDir = path.resolve(process.cwd(), "uploads");

    if (!fs.existsSync(imageDir)) {
      await mkdir(imageDir, { recursive: true });
    }

    const imageId = randomUUID();
    const imageFilename = `${imageId}${ext}`;
    const imagePath = path.join(imageDir, imageFilename);

    writeFile(imagePath, buffer);

    return reply.status(200).send({
      imageUrl: imageFilename,
    });
  });
}

// export async function uploadImage(app: FastifyInstance) {
//   app.post("/upload", async (request, reply) => {
//     const file = await request.file();

//     const allowMimeTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/gif",
//       "image/webp",
//     ];

//     if (!file) {
//       throw new Error("Arquivo não enviado");
//     }

//     if (!allowMimeTypes.includes(file.mimetype)) {
//       throw new Error("Formato de arquivo não permitido");
//     }

//     try {
//       const fileExtension = path.extname(file.filename || "");

//       const fileName = `${randomUUID()}${fileExtension}`;

//       const uploadDir = path.resolve(__dirname, "..", "..", "..", "uploads");
//       //   const uploadDir = path.join(process.cwd(), "src/assets/images/avatars");

//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       const filePath = path.join(uploadDir, fileName);

//       await pump(file.file, fs.createWriteStream(filePath));

//       return {
//         filename: fileName,
//         message: "Arquivo enviado com sucesso",
//       };
//     } catch (error) {
//       return reply.status(500).send("Erro ao fazer upload");
//     }
//   });
// }

import { Request, Response } from "express";

import uploadConfig from "@/config/upload";
import z, { size, ZodError } from "zod";
import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/app-error";

export class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage();
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Filename is required"),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              `Invalid file type. Only images are allowed: ${uploadConfig.ACCEPTED_IMAGE_TYPES.join(
                ", "
              )}`
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_FILE_SIZE,
              `Arquivo excede o tamanho máximo de ${uploadConfig.MAX_SIZE}m`
            ),
        })
        .loose();
      const file = fileSchema.parse(request.file);
      const filename = await diskStorage.saveFile(file.filename);
      return response.json({ filename });
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file?.filename, "tmp");
        }

        throw new AppError(error.message);
      }
    }
  }
}

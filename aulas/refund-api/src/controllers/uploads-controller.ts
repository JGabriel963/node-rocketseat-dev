import { Request, Response } from "express";

import uploadConfig from "@/config/upload";
import z, { size } from "zod";

export class UploadsController {
  async create(request: Request, response: Response) {
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
      const { file } = fileSchema.parse(request.file);

      return response.json({ message: "ok" });
    } catch (error) {
      throw error;
    }
  }
}

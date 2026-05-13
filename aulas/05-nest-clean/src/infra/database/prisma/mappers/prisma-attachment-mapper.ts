import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  Attachment as PrismaAttachment,
} from "@/domain/forum/enterprise/entities/attachment";
import { Prisma } from "generated/prisma/client";

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id as any),
    );
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}

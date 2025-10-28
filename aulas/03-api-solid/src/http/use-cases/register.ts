import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUserCase({
  name,
  email,
  password,
}: RegisterUserCaseRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error("User with same email already exists.");
  }

  const passwordHash = await hash(password, 6);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  });
}

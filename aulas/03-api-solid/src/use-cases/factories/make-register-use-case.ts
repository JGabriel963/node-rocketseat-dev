import { PrismaUsersRepository } from "@/respositories/prisma/prisma-users-repository";
import { RegisterUserCase } from "../register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUserCase = new RegisterUserCase(usersRepository);

  return registerUserCase;
}

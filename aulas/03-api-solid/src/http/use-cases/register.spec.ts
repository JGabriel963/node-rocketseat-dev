import { expect, it, describe } from "vitest";
import { RegisterUserCase } from "./register";
import { PrismaUsersRepository } from "@/respositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/respositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRespository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(usersRespository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Shoud hash user password upon registration", async () => {
    const prismaUserRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(prismaUserRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123123",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Shoud not be able to register with same email twice", async () => {
    const prismaUserRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(prismaUserRepository);

    const email = "johndoe@gmail.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "123123",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email,
        password: "123123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

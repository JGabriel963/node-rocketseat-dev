import { expect, describe, it } from "vitest";
import { RegisterUserCase } from "./register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "234123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "234123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "234123",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserCase(usersRepository);

    const email = "johndoe@example.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "234123",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email,
        password: "234123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

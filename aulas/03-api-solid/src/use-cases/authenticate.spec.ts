import { expect, it, describe, beforeEach } from "vitest";
import { RegisterUserCase } from "./register";
import { PrismaUsersRepository } from "@/respositories/prisma/prisma-users-repository";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/respositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";

let usersRespository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRespository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRespository);
  });

  it("should be able to register", async () => {
    await usersRespository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password_hash: await hash("123123", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@gmail.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRespository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password_hash: await hash("123123", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@gmail.com",
        password: "123124",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

import { expect, it, describe, beforeEach } from "vitest";
import { RegisterUserCase } from "./register";
import { PrismaUsersRepository } from "@/respositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/respositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";

let usersRespository: InMemoryUsersRepository;
let sut: RegisterUserCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRespository = new InMemoryUsersRepository();
    sut = new RegisterUserCase(usersRespository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Shoud hash user password upon registration", async () => {
    const { user } = await sut.execute({
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
    const email = "johndoe@gmail.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123123",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

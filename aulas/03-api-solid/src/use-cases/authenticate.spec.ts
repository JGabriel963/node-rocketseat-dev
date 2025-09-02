import { expect, describe, it, beforeAll } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("234123", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "234123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not to able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe123@example.com",
      password_hash: await hash("234123", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "234123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not to able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("234123", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "234321",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

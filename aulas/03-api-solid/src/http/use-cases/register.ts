import { UserRepository } from "@/respositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUserCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
